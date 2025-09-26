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


export async function enrollInCourseAction(courseId: string): Promise<ApiResponse | never> {
    const user = await requireUser();

    let checkoutUrl: string | null = null;

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.id,
        });



        if(decision.isDenied()) {
            return {
                status: "error",
                message: "you have been blocked due to too many requests. please try again later",
            }
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
            return {
                status: "error",
                message: "Course not found",
            };
        }



        let stripeCustomerId: string;
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        });

        if (userWithStripeCustomerId?.stripeCustomerId) {
            try {
                // Check if the customer exists in Stripe
                await stripe.customers.retrieve(userWithStripeCustomerId.stripeCustomerId);
                stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
                console.log('[Enrollment Debug] Using existing Stripe customer:', stripeCustomerId);
            } catch (error) {
                console.log('[Enrollment Debug] Customer not found in Stripe, creating new one');
                // Customer doesn't exist in Stripe, create a new one
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: user.name,
                    metadata: {
                        userId: user.id,
                    },
                });
                stripeCustomerId = customer.id;

                // Update the user's stripeCustomerId in the database
                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        stripeCustomerId: stripeCustomerId,
                    },
                });
                console.log('[Enrollment Debug] Created new Stripe customer:', stripeCustomerId);
            }
        } else {
            console.log('[Enrollment Debug] No existing customer ID, creating new one');
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id,
                },
            });
            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: stripeCustomerId,
                },
            });
            console.log('[Enrollment Debug] Created new Stripe customer:', stripeCustomerId);
        }



        const result = await prisma.$transaction(async (tx) => {
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: course.id,
                    },
                },
                select: {
                    status: true,
                    id: true,
                }
            });

            if (existingEnrollment?.status === "Active") {
                return {
                    status: "error",
                    message: "You are already enrolled in this course",
                };
            }


            let enrollment


            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        amout: course.price,
                        status: "Pending",
                        updatedAt: new Date(),
                    }
                })
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amout: course.price,
                        status: "Pending",
                    },
                });
            }

            console.log('[Enrollment Debug] Creating checkout session with:', {
                customer: stripeCustomerId,
                price: course.stripePriceId,
                courseId: course.id,
                courseTitle: course.title,
                userId: user.id
            });

            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: course.stripePriceId,
                        quantity: 1,
                    }
                ],
                mode: 'payment',
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                },
            });

            console.log('[Enrollment Debug] Checkout session created successfully:', checkoutSession.id);

            return {
                enrollment: enrollment,
                checkoutUrl: checkoutSession.url,
            }
        });

        checkoutUrl = result.checkoutUrl as string;
    } catch (error) {
        console.error('[Enrollment Error] Full error details:', error);

        if (error instanceof Stripe.errors.StripeError) {
            console.error('[Enrollment Error] Stripe error:', error.message, error.type, error.code);
            return {
                status: 'error',
                message: 'Payment system error. please try again later'
            }
        }

        console.error('[Enrollment Error] Non-Stripe error:', error);

        return {
            status: "error",
            message: "Failed to enroll in course",
        };
    }


    if (!checkoutUrl) {
        return {
            status: "error",
            message: "Failed to create checkout session",
        };
    }

    redirect(checkoutUrl)
}