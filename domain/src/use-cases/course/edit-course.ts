import { CourseService, CategoryService, UserService } from "../../services";
import { Course } from "../../entities";
import { UserRole } from "../../utils/enums/userRole";

export interface UpdateCourseDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function updateCourse(
    id: string,
    data: Partial<Course>,
    deps: UpdateCourseDeps
) {
    const { courseService, categoryService, userService } = deps;

    if (data.categoryId) {
        const category = await categoryService.findById(data.categoryId);
        if (!category) {
            throw new Error(`Categoría con id ${data.categoryId} no existe`);
        }
    }

    if (data.teacherId) {
        const user = await userService.findById(data.teacherId);
        if (!user) {
            throw new Error(`Usuario con id ${data.teacherId} no existe`);
        }
        if (user.role !== UserRole.TEACHER) {
            throw new Error("Solo un usuario con rol 'teacher' puede editar el curso");
        }
    }

    return await courseService.editOne(id, data);
}
