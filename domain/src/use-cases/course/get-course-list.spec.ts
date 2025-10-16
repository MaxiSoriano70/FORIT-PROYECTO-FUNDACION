import { describe, test, expect, vi } from "vitest";
import { getCourseById } from "../../use-cases/course/get-course-by-id";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";

describe("Obtener curso por ID", () => {
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

        const spyFindById = vi.spyOn(courseService, "findById");

        const result = await getCourseById("course1", { courseService, categoryService, userService });

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(spyFindById).toHaveBeenCalledWith("course1");

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

        await expect(getCourseById("noExiste", { courseService, categoryService, userService }))
            .rejects
            .toThrowError("Curso con id noExiste no encontrado");
    });

    test("Debería lanzar error si la categoría no existe", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([teacher]);

        await expect(getCourseById("course1", { courseService, categoryService, userService }))
            .rejects
            .toThrowError(`Categoría con id ${course.categoryId} no encontrada`);
    });

    test("Debería devolver curso con teacher undefined si el docente no existe", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([]);

        const result = await getCourseById("course1", { courseService, categoryService, userService });

        expect(result.teacher).toBeUndefined();
        expect(result.category).toEqual(category);
        expect(result.id).toBe(course.id);
    });

    test("Debería devolver curso con teacher undefined si no tiene docente asignado", async () => {
        const courseSinDocente = courseMock({
            id: "course2",
            name: "Node.js",
            categoryId: "cat1",
        });

        const courseService = new MockedCourseService([courseSinDocente]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([]);

        const result = await getCourseById("course2", { courseService, categoryService, userService });

        expect(result.teacher).toBeUndefined();
        expect(result.category).toEqual(category);
        expect(result.id).toBe(courseSinDocente.id);
    });
});
