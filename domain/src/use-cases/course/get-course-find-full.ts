import { CategoryService, CourseService, UserService } from "../../services";

export interface GetFullCoursesDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getFullCourses(deps: GetFullCoursesDeps) {
    const { courseService, categoryService, userService } = deps;

    const courses = await courseService.findFullCourses();
    if (!courses || courses.length === 0) {
        throw new Error("No se encontraron cursos completos");
    }

    const result = await Promise.all(
        courses.map(async (course) => {
            const category = await categoryService.findById(course.categoryId);

            const teacher = course.teacherId
                ? await userService.findById(course.teacherId) ?? undefined
                : undefined;

            return { ...course, category, teacher };
        })
    );

    return result;
}