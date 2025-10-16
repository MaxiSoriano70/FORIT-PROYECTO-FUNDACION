import { describe, test, expect, vi } from "vitest";
import { getCourseFindByName } from "../../use-cases/course/get-course-find-by-name";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";

describe("Obtener curso por nombre", () => {
    const category = categoryMock({ id: "cat1", name: "Programación" });
    const teacher = userMock({ id: "teacher1", firstName: "Ana", lastName: "Gómez" });
    const course = courseMock({
        id: "course1",
        name: "React Avanzado",
        categoryId: "cat1",
        teacherId: "teacher1",
    });

    test("Debería devolver curso con categoría y docente", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        const spyFindByName = vi.spyOn(courseService, "findByName");

        const result = await getCourseFindByName("React Avanzado", {
            courseService,
            categoryService,
            userService,
        });

        expect(spyFindByName).toHaveBeenCalledTimes(1);
        expect(spyFindByName).toHaveBeenCalledWith("React Avanzado");

        expect(result).toEqual({
            ...course,
            category,
            teacher,
        });
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        await expect(
            getCourseFindByName("No Existe", { courseService, categoryService, userService })
        ).rejects.toThrowError("Curso con nombre No Existe no encontrado");
    });

    test("Debería lanzar error si la categoría no existe", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([teacher]);

        await expect(
            getCourseFindByName("React Avanzado", { courseService, categoryService, userService })
        ).rejects.toThrowError(`Categoría con id ${course.categoryId} no encontrada`);
    });

    test("Debería devolver curso aunque el docente no exista", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([]);

        const result = await getCourseFindByName("React Avanzado", {
            courseService,
            categoryService,
            userService,
        });

        expect(result).toEqual({
            ...course,
            category,
            teacher: undefined,
        });
    });
});
