import { describe, test, expect, vi } from "vitest";
import { getCourseFindByTeacherId } from "../../use-cases/course/get-course-find-by-teacher-id";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";

describe("Obtener cursos por id de docente", () => {
    const teacher = userMock({ id: "teacher1", firstName: "Ana", lastName: "Gómez" });
    const category = categoryMock({ id: "cat1", name: "Programación" });

    const course1 = courseMock({
        id: "course1",
        name: "React Avanzado",
        categoryId: "cat1",
        teacherId: "teacher1",
    });

    const course2 = courseMock({
        id: "course2",
        name: "Node.js desde cero",
        categoryId: "cat1",
        teacherId: "teacher1",
    });

    test("Debería devolver lista de cursos con docente y categoría", async () => {
        const courseService = new MockedCourseService([course1, course2]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        const spyFindByTeacherId = vi.spyOn(courseService, "findByTeacherId");

        const result = await getCourseFindByTeacherId("teacher1", {
            courseService,
            categoryService,
            userService,
        });

        expect(spyFindByTeacherId).toHaveBeenCalledTimes(1);
        expect(spyFindByTeacherId).toHaveBeenCalledWith("teacher1");

        expect(result).toEqual([
            { ...course1, category, teacher },
            { ...course2, category, teacher },
        ]);
    });

    test("Debería lanzar error si no hay cursos para el docente", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        await expect(
            getCourseFindByTeacherId("teacher1", { courseService, categoryService, userService })
        ).rejects.toThrowError("No se encontraron cursos para el docente con id teacher1");
    });

    test("Debería lanzar error si el docente no existe", async () => {
        const courseService = new MockedCourseService([course1]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([]);

        await expect(
            getCourseFindByTeacherId("teacher1", { courseService, categoryService, userService })
        ).rejects.toThrowError("Docente con id teacher1 no encontrado");
    });

    test("Debería devolver cursos aunque la categoría no exista", async () => {
        const courseService = new MockedCourseService([course1, course2]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([teacher]);

        const result = await getCourseFindByTeacherId("teacher1", {
            courseService,
            categoryService,
            userService,
        });

        expect(result).toEqual([
            { ...course1, category: undefined, teacher },
            { ...course2, category: undefined, teacher },
        ]);
    });
});
