import { describe, test, expect, vi } from "vitest";

import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";
import { UserRole } from "../../utils/enums/userRole";
import { updateCourse } from "./edit-course";

describe("Actualizar curso", () => {
    const category = categoryMock({ id: "cat1", name: "Programación" });
    const newCategory = categoryMock({ id: "cat2", name: "Diseño UX" });

    const teacher = userMock({
        id: "teacher1",
        firstName: "Ana",
        lastName: "Gómez",
        role: UserRole.TEACHER
    });

    const student = userMock({
        id: "student1",
        firstName: "Carlos",
        lastName: "Pérez",
        role: UserRole.STUDENT
    });

    const course = courseMock({
        id: "course1",
        name: "React Avanzado",
        categoryId: "cat1",
        teacherId: "teacher1"
    });

    test("Debería actualizar el curso correctamente", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([category, newCategory]);
        const userService = new MockedUserService([teacher]);

        const spyEditOne = vi.spyOn(courseService, "editOne");

        const dataToUpdate = { name: "React Pro", categoryId: "cat2", teacherId: "teacher1" };

        const result = await updateCourse("course1", dataToUpdate, {
            courseService,
            categoryService,
            userService
        });

        expect(spyEditOne).toHaveBeenCalledWith("course1", dataToUpdate);
        expect(result.name).toBe("React Pro");
        expect(result.categoryId).toBe("cat2");
        expect(result.teacherId).toBe("teacher1");
    });

    test("Debería lanzar error si la nueva categoría no existe", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        await expect(
            updateCourse("course1", { categoryId: "noExiste" }, {
                courseService,
                categoryService,
                userService
            })
        ).rejects.toThrowError("Categoría con id noExiste no existe");
    });

    test("Debería lanzar error si el nuevo docente no existe", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]); // el nuevo no está

        await expect(
            updateCourse("course1", { teacherId: "noExiste" }, {
                courseService,
                categoryService,
                userService
            })
        ).rejects.toThrowError("Usuario con id noExiste no existe");
    });

    test("Debería lanzar error si el nuevo docente no tiene rol TEACHER", async () => {
        const courseService = new MockedCourseService([course]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([student]);

        await expect(
            updateCourse("course1", { teacherId: "student1" }, {
                courseService,
                categoryService,
                userService
            })
        ).rejects.toThrowError("Solo un usuario con rol 'teacher' puede editar el curso");
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        await expect(
            updateCourse("noExiste", { name: "Nuevo nombre" }, {
                courseService,
                categoryService,
                userService
            })
        ).rejects.toThrowError("Curso con id noExiste no encontrado");
    });
});