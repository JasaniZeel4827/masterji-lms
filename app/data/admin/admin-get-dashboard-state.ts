import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
    await requireAdmin();

    //   const [] = await Promise.all([
    const [totalSignups, totalCustomers, totalCourses, totalLessons] = await Promise.all([

        //total signups
        prisma.user.count(),

        //total customers
        prisma.user.count({
            where: {
                enrollment: {
                    some: {},
                },
            },
        }),



        prisma.course.count(),

        prisma.lesson.count(),

    ]);



    return {
        totalSignups,
        totalCustomers,
        totalCourses,
        totalLessons,
    };
}