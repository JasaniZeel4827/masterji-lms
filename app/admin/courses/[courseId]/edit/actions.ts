"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType, courseSchema } from "@/lib/zodSchemas";
import { prisma } from "@/lib/db";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
// import { User } from "lucide-react";
// import { request } from "http";









const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: [],
        })
    ).withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 2,
        })
    );



// import { requireAdmin } from "@/app/data/admin/require-admin";
// import { ApiResponse } from "@/lib/types";


export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    try {
        // const req = await request();
        // const decision = await aj.protect(req, {
        //     fingerprint: user.user.id
        // });


        const user = await requireAdmin();
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.user.id,
        });




        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "you have been blocked due to rate limit, from masterji.com"
                };
            } else {
                return {
                    status: 'error',
                    message: 'i think you are bot'
                };
            }
        }



        try {
            const result = courseSchema.safeParse(data);


            if (!result.success) {
                return {
                    status: "error",
                    message: "invalid data",
                }
            }
        } catch (error) {
            return {
                status: "error",
                message: "Data validation failed",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id,
            },
            data: {
                ...data,
            }
        });

        return {
            status: "success",
            message: "Course updated successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to update course",
        };
    }
}

export async function reorderLesson(
    chapterId: string,
    lesson: { id: string; position: number }[],
    courseId: string
): Promise<ApiResponse> {
    await requireAdmin();
    try {
        if (!lesson || lesson.length === 0) {
            return {
                status: "error",
                message: "no lesson provided for reorderning"
            };
        }


        // const updates = lesson.map((lesson) => ({
        //     prisma.lesson.update({
        //         where: {
        //             id: lesson.id,
        //             chapterId: chapterId,
        //         },
        //         data: {
        //             position: lesson
        //         }
        //     })
        // }))


        const updates = lesson.map((lesson: { id: string; position: number }) =>
            prisma.lesson.update({
                where: {
                    id: lesson.id,
                    chapterId: chapterId,
                },
                data: {
                    position: lesson.position,
                }
            })
        );


        await prisma.$transaction(updates);


        revalidatePath(`/admin/courses/${courseId}/edit`)


        return {
            status: "success",
            message: "lessons reorder successfully"
        }
    } catch {
        return {
            status: "error",
            message: "failed to reorder lessson"
        }
    }

}


export async function reorderChapters(
    courseId: string,
    chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
    await requireAdmin();
    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "no chapter are provided here"
            };
        }

        const updates = chapters.map((chapter) => prisma.chapter.update({
            where: {
                id: chapter.id,
                courseId: courseId,
            },
            data: {
                position: chapter.position,
            }
        }))

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "chapter reorder successfully"
        }

    } catch {
        return {
            status: "error",
            message: "failed to reorder chapter"
        }
    }
}