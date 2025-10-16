import { CategoryService, CourseService, UserService } from "../../services";

export interface GetCourseFindByNameDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getCourseFindByName(
    name: string,
    deps: GetCourseFindByNameDeps
) {
    const { courseService, categoryService, userService } = deps;

    const course = await courseService.findByName(name);
    if (!course) {
        throw new Error(`Curso con nombre ${name} no encontrado`);
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
