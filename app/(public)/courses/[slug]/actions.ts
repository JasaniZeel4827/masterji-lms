"use server";

import { ApiResponse } from "@/lib/types";
import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
// import arcjet, { fixedWindow } from "@lib/arcjet";




const aj = arcjet.withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
    })
)


export async function enrollInCourseAction(courseId: string): Promise<ApiResponse> {
    const user = await requireUser();

    let checkoutUrl: string | null = null;

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.id,
        });

        if(decision.isDenied()) {
            throw new Error("you have been blocked due to too many requests. please try again later");
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                id: true,
                title: true,
                price: true,
                slug: true,
                stripePriceId: true,
            },
        });

        if (!course) {
            throw new Error("Course not found");
        }

        console.log('[Enrollment Debug] Starting enrollment process for user:', user.id, 'course:', courseId);

        let stripeCustomerId: string;
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        });

        console.log('[Enrollment Debug] User stripeCustomerId from DB:', userWithStripeCustomerId?.stripeCustomerId);

        const transactionResult = await prisma.$transaction(async (tx) => {
            console.log('[Enrollment Debug] Starting database transaction');

            // Always create a fresh customer to avoid race conditions
            console.log('[Enrollment Debug] Creating fresh customer for enrollment');
            const freshCustomer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id },
            });

            // Update database with new customer ID
            await tx.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: freshCustomer.id },
            });

            console.log('[Enrollment Debug] Created fresh customer:', freshCustomer.id);

            // Get fresh course data inside transaction to ensure we have current pricing
            const currentCourse = await tx.course.findUnique({
                where: { id: courseId },
                select: {
                    id: true,
                    title: true,
                    price: true,
                    stripePriceId: true,
                    slug: true,
                }
            });

            if (!currentCourse) {
                throw new Error('Course not found');
            }

            console.log('[Enrollment Debug] Course price inside transaction:', currentCourse.price, 'cents');

            // Use the actual course price directly (no minimum adjustment)
            const stripePrice = currentCourse.price;
            console.log('[Enrollment Debug] Using original course price:', stripePrice, 'cents');

            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId,
                    },
                },
                select: {
                    status: true,
                    id: true,
                }
            });

            console.log('[Enrollment Debug] Existing enrollment found:', existingEnrollment?.id, 'status:', existingEnrollment?.status);

            if (existingEnrollment?.status === "Active") {
                throw new Error("You are already enrolled in this course");
            }

            let enrollment;

            if (existingEnrollment) {
                console.log('[Enrollment Debug] Updating existing enrollment:', existingEnrollment.id);
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        amout: currentCourse.price, // Store original course price
                        status: "Pending",
                        updatedAt: new Date(),
                    }
                })
            } else {
                console.log('[Enrollment Debug] Creating new enrollment');
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: courseId,
                        amout: currentCourse.price, // Store original course price
                        status: "Pending",
                    },
                });
            }

            console.log('[Enrollment Debug] Enrollment created/updated:', enrollment.id);

            console.log('[Enrollment Debug] Creating checkout session with fresh customer:', freshCustomer.id);

            // Create price data for Stripe using original course price
            const lineItems = [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: currentCourse.title,
                    },
                    unit_amount: stripePrice, // Use original course price
                },
                quantity: 1,
            }];

            let checkoutSession;
            try {
                checkoutSession = await stripe.checkout.sessions.create({
                    customer: freshCustomer.id,
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                    cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                    metadata: {
                        userId: user.id,
                        courseId: courseId,
                        enrollmentId: enrollment.id,
                        coursePrice: currentCourse.price.toString(),
                    },
                });
            } catch (stripeError: any) {
                // Handle specific Stripe errors
                if (stripeError.code === 'amount_too_small') {
                    console.log('[Enrollment Debug] Amount too small, creating minimum price session');

                    // Create a minimum viable session with $0.50
                    const minimumLineItems = [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `${currentCourse.title} (Minimum Payment)`,
                                description: `Original price: ₹${currentCourse.price}. Processing minimum payment.`,
                            },
                            unit_amount: 50, // $0.50 minimum
                        },
                        quantity: 1,
                    }];

                    checkoutSession = await stripe.checkout.sessions.create({
                        customer: freshCustomer.id,
                        line_items: minimumLineItems,
                        mode: 'payment',
                        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                        metadata: {
                            userId: user.id,
                            courseId: courseId,
                            enrollmentId: enrollment.id,
                            coursePrice: currentCourse.price.toString(),
                            minimumPayment: 'true',
                            actualPrice: currentCourse.price.toString(),
                        },
                    });
                } else {
                    throw stripeError;
                }
            }

            console.log('[Enrollment Debug] Checkout session created successfully:', checkoutSession.id);
            console.log('[Enrollment Debug] Checkout session URL:', checkoutSession.url);

            // Validate checkout session has a URL
            if (!checkoutSession.url) {
                console.error('[Enrollment Error] Checkout session created but no URL returned:', checkoutSession);
                throw new Error('Checkout session created but no URL available');
            }

            return {
                enrollment: enrollment,
                checkoutUrl: checkoutSession.url,
            }
        }, {
            timeout: 30000, // 30 second timeout
        });

        console.log('[Enrollment Debug] Transaction completed successfully');
        console.log('[Enrollment Debug] Transaction result:', JSON.stringify(transactionResult, null, 2));

        if (!transactionResult) {
            throw new Error('Transaction returned null result');
        }

        if (!transactionResult.checkoutUrl) {
            throw new Error('Transaction completed but no checkout URL in result');
        }

        console.log('[Enrollment Debug] Redirecting to:', transactionResult.checkoutUrl);
        redirect(transactionResult.checkoutUrl);

    } catch (error) {
        console.error('[Enrollment Error] Enrollment failed:', error);

        // Don't catch NEXT_REDIRECT errors - let them bubble up for Next.js to handle
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }

        if (error instanceof Error) {
            if (error.message.includes("blocked") || error.message.includes("too many requests")) {
                return {
                    status: "error",
                    message: error.message,
                };
            }

            if (error.message.includes("Course not found")) {
                return {
                    status: "error",
                    message: error.message,
                };
            }

            if (error.message.includes("already enrolled")) {
                return {
                    status: "error",
                    message: error.message,
                };
            }

            if (error instanceof Stripe.errors.StripeError) {
                return {
                    status: 'error',
                    message: 'Payment system error. Please try again later.'
                };
            }

            return {
                status: "error",
                message: error.message,
            };
        }

        return {
            status: "error",
            message: "Failed to enroll in course",
        };
    }
}