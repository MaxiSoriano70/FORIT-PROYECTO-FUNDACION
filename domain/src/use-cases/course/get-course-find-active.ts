import { CategoryService, CourseService, UserService } from "../../services";

export interface GetActiveCoursesDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getActiveCourses(deps: GetActiveCoursesDeps) {
    const { courseService, categoryService, userService } = deps;

    const courses = await courseService.findActiveCourses();
    if (!courses || courses.length === 0) {
        throw new Error("No se encontraron cursos activos");
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
