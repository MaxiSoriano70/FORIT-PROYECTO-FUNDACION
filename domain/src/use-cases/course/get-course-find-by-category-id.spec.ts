import { describe, test, expect, vi } from "vitest";
import { getCourseFindByCategoryId } from "../../use-cases/course/get-course-find-by-category-id";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";

describe("Obtener cursos por id de categoría", () => {
    const category = categoryMock({ id: "cat1", name: "Programación" });
    const teacher = userMock({ id: "teacher1", firstName: "Ana", lastName: "Gómez" });

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

    test("Debería devolver lista de cursos con categoría y docente", async () => {
        const courseService = new MockedCourseService([course1, course2]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        const spyFindByCategoryId = vi.spyOn(courseService, "findByCategoryId");

        const result = await getCourseFindByCategoryId("cat1", {
            courseService,
            categoryService,
            userService,
        });

        expect(spyFindByCategoryId).toHaveBeenCalledTimes(1);
        expect(spyFindByCategoryId).toHaveBeenCalledWith("cat1");

        expect(result).toEqual([
            { ...course1, category, teacher },
            { ...course2, category, teacher },
        ]);
    });

    test("Debería lanzar error si no hay cursos para la categoría", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        await expect(
            getCourseFindByCategoryId("cat1", { courseService, categoryService, userService })
        ).rejects.toThrowError("No se encontraron cursos para la categoría con id cat1");
    });

    test("Debería lanzar error si la categoría no existe", async () => {
        const courseService = new MockedCourseService([course1]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([teacher]);

        await expect(
            getCourseFindByCategoryId("cat1", { courseService, categoryService, userService })
        ).rejects.toThrowError("Categoría con id cat1 no encontrada");
    });

    test("Debería devolver cursos aunque el docente no exista", async () => {
        const courseService = new MockedCourseService([course1, course2]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([]);

        const result = await getCourseFindByCategoryId("cat1", {
            courseService,
            categoryService,
            userService,
        });

        expect(result).toEqual([
            { ...course1, category, teacher: undefined },
            { ...course2, category, teacher: undefined },
        ]);
    });
});
