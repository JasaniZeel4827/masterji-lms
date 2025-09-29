import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// Helper function to log errors consistently
const logError = (message: string, error?: any) => {
    console.error(`[Stripe Webhook Error] ${message}`, error || '');
};

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
        console.log(`[Stripe Webhook] Received event: ${event.type}`);
    } catch (error) {
        logError('Invalid signature', error);
        return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const session = event.data.object as Stripe.Checkout.Session;

        if (event.type === "checkout.session.completed") {
            const courseId = session.metadata?.courseId;
            const customerId = session.customer as string;

            if (!courseId) {
                throw new Error("Course ID not found in session metadata");
            }

            // Find user by stripeCustomerId
            const user = await prisma.user.findUnique({
                where: { stripeCustomerId: customerId },
            });

            if (!user) {
                throw new Error(`User not found for customer ID: ${customerId}`);
            }

            // Check if enrollment already exists
            const existingEnrollment = await prisma.enrollment.findFirst({
                where: {
                    userId: user.id,
                    courseId: courseId,
                },
            });

            if (existingEnrollment) {
                console.log(`[Stripe Webhook] User ${user.id} is already enrolled in course ${courseId}`);
                return new Response(JSON.stringify({ message: 'User already enrolled' }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Update the existing enrollment to Active status
            const enrollmentId = session.metadata?.enrollmentId;

            if (enrollmentId) {
                // Try to update the existing enrollment first
                try {
                    const updatedEnrollment = await prisma.enrollment.updateMany({
                        where: {
                            id: enrollmentId,
                            userId: user.id,
                            courseId: courseId,
                        },
                        data: {
                            status: "Active",
                            amout: session.amount_total ? Number(session.amount_total) / 100 : 0,
                            updatedAt: new Date(),
                        },
                    });

                    if (updatedEnrollment.count > 0) {
                        console.log(`[Stripe Webhook] Successfully updated enrollment ${enrollmentId} to Active`);
                        return new Response(JSON.stringify({ received: true }), { 
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    } else {
                        console.log(`[Stripe Webhook] Enrollment ${enrollmentId} not found, creating new one with auto-generated ID`);
                    }
                } catch (updateError) {
                    console.log(`[Stripe Webhook] Error updating enrollment ${enrollmentId}, creating new one:`, updateError);
                }

                // Fallback: create new enrollment if update failed
                await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: courseId,
                        amout: session.amount_total ? Number(session.amount_total) / 100 : 0,
                        status: "Active",
                    },
                });
                console.log(`[Stripe Webhook] Created new enrollment for user ${user.id} in course ${courseId}`);
            } else {
                console.log(`[Stripe Webhook] No enrollmentId in metadata, creating new enrollment`);
                // Fallback: create new enrollment if no enrollmentId
                await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: courseId,
                        amout: session.amount_total ? Number(session.amount_total) / 100 : 0,
                        status: "Active",
                    },
                });
                console.log(`[Stripe Webhook] Created new enrollment for user ${user.id} in course ${courseId}`);
            }

            console.log(`[Stripe Webhook] Successfully processed enrollment for user ${user.id} in course ${courseId}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        logError('Error processing webhook', error);
        return new Response(
            JSON.stringify({
                error: 'Webhook handler failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
