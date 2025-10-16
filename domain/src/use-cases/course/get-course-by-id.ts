import { CategoryService, CourseService, UserService } from "../../services";

export interface GetCourseByIdDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getCourseById(
    id: string,
    deps: GetCourseByIdDeps
) {
    const { courseService, categoryService, userService } = deps;

    const course = await courseService.findById(id);
    if (!course) {
        throw new Error(`Curso con id ${id} no encontrado`);
    }

    const category = await categoryService.findById(course.categoryId);
    if (!category) {
        throw new Error(`Categoría con id ${course.categoryId} no encontrada`);
    }

    let teacher = undefined;
    if (course.teacherId) {
        teacher = await userService.findById(course.teacherId) ?? undefined;
    }

    return {
        ...course,
        category,
        teacher,
    };
}
