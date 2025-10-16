import { CourseService, CategoryService, UserService } from "../../services";

export interface GetCourseListDeps {
    courseService: CourseService;
    categoryService: CategoryService;
    userService: UserService;
}

export async function getCourseList(deps: GetCourseListDeps) {
    const courses = await deps.courseService.findAll();

    const result = await Promise.all(
        courses.map(async (course) => {
            const category = await deps.categoryService.findById(course.categoryId);
            const teacher = course.teacherId
                ? await deps.userService.findById(course.teacherId)
                : undefined;

            return {
                ...course,
                category: category ? { id: category.id, name: category.name } : null,
                teacher: teacher
                    ? { id: teacher.id, firstName: teacher.firstName, lastName: teacher.lastName }
                    : null,
            };
        })
    );

    return result;
}
