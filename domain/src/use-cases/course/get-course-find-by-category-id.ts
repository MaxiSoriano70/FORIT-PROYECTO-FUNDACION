import { CategoryService, CourseService, UserService } from "../../services";

export interface GetCourseFindByCategoryIdDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getCourseFindByCategoryId(
    categoryId: string,
    deps: GetCourseFindByCategoryIdDeps
) {
    const { courseService, categoryService, userService } = deps;

    const courses = await courseService.findByCategoryId(categoryId);
    if (!courses || courses.length === 0) {
        throw new Error(`No se encontraron cursos para la categoría con id ${categoryId}`);
    }

    const category = await categoryService.findById(categoryId);
    if (!category) {
        throw new Error(`Categoría con id ${categoryId} no encontrada`);
    }

    const result = await Promise.all(
        courses.map(async (course) => {
            let teacher = undefined;
            if (course.teacherId) {
                teacher = await userService.findById(course.teacherId) ?? undefined;
            }

            return {
                ...course,
                category,
                teacher,
            };
        })
    );

    return result;
}
