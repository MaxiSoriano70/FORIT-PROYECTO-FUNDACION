import { describe, expect, test, vi } from "vitest";
import { saveCourse } from "../../use-cases/course/save-course";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";
import { UserRole } from "../../utils/enums/userRole";

describe("Guardar curso", () => {
    const category = categoryMock({ id: "cat1", name: "Programación" });
    const teacher = userMock({ id: "teacher1", firstName: "Juan", role: UserRole.TEACHER });

    test("Debería guardar un curso nuevo correctamente", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        const spySave = vi.spyOn(courseService, "save");

        const newCourse = courseMock({
            id: "course2",
            name: "React Avanzado",
            categoryId: "cat1",
            teacherId: "teacher1"
        });

        await saveCourse(newCourse, { courseService, categoryService, userService });

        expect(spySave).toHaveBeenCalledTimes(1);
        expect(spySave).toHaveBeenCalledWith(newCourse);

        const allCourses = await courseService.findAll();
        expect(allCourses).toHaveLength(1);
        expect(allCourses.map(c => c.id)).toContain("course2");
    });

    test("Debería lanzar error si la categoría no existe", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([teacher]);

        const invalidCourse = courseMock({
            id: "course3",
            name: "Node.js",
            categoryId: "noExiste",
            teacherId: "teacher1"
        });

        await expect(
            saveCourse(invalidCourse, { courseService, categoryService, userService })
        ).rejects.toThrowError("Categoría con id noExiste no encontrada");
    });

    test("Debería lanzar error si el docente no existe", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([]);

        const invalidCourse = courseMock({
            id: "course4",
            name: "Angular",
            categoryId: "cat1",
            teacherId: "noExiste"
        });

        await expect(
            saveCourse(invalidCourse, { courseService, categoryService, userService })
        ).rejects.toThrowError("Docente con id noExiste no encontrado");
    });
});
