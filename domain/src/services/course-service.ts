import { Course } from "../entities";
import { Service } from "../utils/types/service";

export interface CourseService extends Service<Course> {
    findByName: (name: string) => Promise<Course | undefined>;
    findByCategoryId: (categoryId: string) => Promise<Course[]>; // cursos por categoría
    findByTeacherId: (teacherId: string) => Promise<Course[]>;   // cursos de un docente
    findActiveCourses: () => Promise<Course[]>;                  // cursos cuyo endDate >= hoy
    findUpcomingCourses: () => Promise<Course[]>;                // cursos cuyo startDate >= hoy
    findFullCourses: () => Promise<Course[]>;                    // cursos con enrolledCount >= maxCapacity
}