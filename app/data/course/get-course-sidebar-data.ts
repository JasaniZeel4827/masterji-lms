import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {
  const session = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      description: true,
      level: true,
      duration: true,
      category: true,
      slug: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: 'asc'
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: session.id,
                },
                select: {
                  completed: true,
                  lessonId: true,
                  id: true,
                }
              }
            }
          }
        }
      }
    },
  });



  if(!course) {
    return notFound();
  }



  const enrollment = await prisma.enrollment.findUnique({
    where: {
        userId_courseId: {
        courseId: course.id,
        userId: session.id,
      },
    },
  });


  if(!enrollment || enrollment.status !== "Active") {
    return notFound();
  }



  return {
    course,
  }
}




export type getCourseSidebarDataType = Awaited<
    ReturnType<typeof getCourseSidebarData>
>;