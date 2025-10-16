import { describe, test, expect, vi } from "vitest";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";
import { getFullCourses } from "./get-course-find-full";

describe("Obtener cursos completos", () => {
    const teacher = userMock({ id: "teacher1", firstName: "Ana", lastName: "Gómez" });
    const category = categoryMock({ id: "cat1", name: "Programación" });

    const fullCourse = courseMock({
        id: "course1",
        name: "React Avanzado",
        categoryId: "cat1",
        teacherId: "teacher1",
        enrolledCount: 30,
        maxCapacity: 30,
    });

    const notFullCourse = courseMock({
        id: "course2",
        name: "Node.js desde cero",
        categoryId: "cat1",
        teacherId: "teacher1",
        enrolledCount: 10,
        maxCapacity: 30,
    });

    test("Debería devolver cursos completos con categoría y docente", async () => {
        const courseService = new MockedCourseService([fullCourse, notFullCourse]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        const spyFindFull = vi.spyOn(courseService, "findFullCourses");

        const result = await getFullCourses({ courseService, categoryService, userService });

        expect(spyFindFull).toHaveBeenCalledTimes(1);
        expect(result).toEqual([
            { ...fullCourse, category, teacher },
        ]);
    });

    test("Debería lanzar error si no hay cursos completos", async () => {
        const courseService = new MockedCourseService([notFullCourse]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        await expect(
            getFullCourses({ courseService, categoryService, userService })
        ).rejects.toThrowError("No se encontraron cursos completos");
    });

    test("Debería devolver curso completo aunque no tenga docente", async () => {
        const courseWithoutTeacher = courseMock({
            id: "course3",
            name: "Vue 3 Intermedio",
            categoryId: "cat1",
            enrolledCount: 20,
            maxCapacity: 20,
        });

        const courseService = new MockedCourseService([courseWithoutTeacher]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([]);

        const result = await getFullCourses({ courseService, categoryService, userService });

        expect(result).toEqual([
            { ...courseWithoutTeacher, category, teacher: undefined },
        ]);
    });
});
