import { Course } from "../../entities";
import { CategoryService, CourseService, UserService } from "../../services";

export interface SaveCourseDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function saveCourse(course: Course, deps: SaveCourseDeps) {
    const { courseService, categoryService, userService } = deps;

    const category = await categoryService.findById(course.categoryId);
    if (!category) {
        throw new Error(`Categoría con id ${course.categoryId} no encontrada`);
    }

    if (course.teacherId) {
        const teacher = await userService.findById(course.teacherId);
        if (!teacher) {
            throw new Error(`Docente con id ${course.teacherId} no encontrado`);
        }
    }

    await courseService.save(course);
    return course;
}
