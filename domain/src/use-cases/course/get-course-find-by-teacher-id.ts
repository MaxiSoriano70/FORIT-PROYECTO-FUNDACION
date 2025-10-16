import { CategoryService, CourseService, UserService } from "../../services";

export interface GetCourseFindByTeacherIdDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getCourseFindByTeacherId(
    teacherId: string,
    deps: GetCourseFindByTeacherIdDeps
) {
    const { courseService, categoryService, userService } = deps;

    const courses = await courseService.findByTeacherId(teacherId);
    if (!courses || courses.length === 0) {
        throw new Error(`No se encontraron cursos para el docente con id ${teacherId}`);
    }

    const teacher = await userService.findById(teacherId);
    if (!teacher) {
        throw new Error(`Docente con id ${teacherId} no encontrado`);
    }

    const result = await Promise.all(
        courses.map(async (course) => {
            let category = undefined;
            if (course.categoryId) {
                category = await categoryService.findById(course.categoryId) ?? undefined;
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
