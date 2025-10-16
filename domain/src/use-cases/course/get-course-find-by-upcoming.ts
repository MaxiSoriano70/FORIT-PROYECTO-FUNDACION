import { CategoryService, CourseService, UserService } from "../../services";

export interface GetUpcomingCoursesDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getUpcomingCourses(deps: GetUpcomingCoursesDeps) {
    const { courseService, categoryService, userService } = deps;

    const courses = await courseService.findUpcomingCourses();
    if (!courses || courses.length === 0) {
        throw new Error("No se encontraron cursos próximos a comenzar");
    }

    const result = await Promise.all(
        courses.map(async (course) => {
            const category = course.categoryId
                ? await categoryService.findById(course.categoryId) ?? undefined
                : undefined;

            const teacher = course.teacherId
                ? await userService.findById(course.teacherId) ?? undefined
                : undefined;

            return { ...course, category, teacher };
        })
    );

    return result;
}
