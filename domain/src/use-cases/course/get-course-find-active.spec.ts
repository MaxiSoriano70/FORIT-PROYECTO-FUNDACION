import { describe, test, expect, vi } from "vitest";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";
import { getActiveCourses } from "./get-course-find-active";

describe("Obtener cursos activos", () => {
    const category = categoryMock({ id: "cat1", name: "Programación" });
    const teacher = userMock({ id: "teacher1", firstName: "Ana", lastName: "Gómez" });

    const today = new Date();
    const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeCourse = courseMock({
        id: "course1",
        name: "React Avanzado",
        categoryId: "cat1",
        teacherId: "teacher1",
        startDate: pastDate,
        endDate: futureDate,
    });

    const inactiveCourse = courseMock({
        id: "course2",
        name: "Node.js desde cero",
        categoryId: "cat1",
        teacherId: "teacher1",
        startDate: pastDate,
        endDate: pastDate,
    });

    test("Debería devolver los cursos activos con categoría y docente", async () => {
        const courseService = new MockedCourseService([activeCourse, inactiveCourse]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        const spy = vi.spyOn(courseService, "findActiveCourses");

        const result = await getActiveCourses({ courseService, categoryService, userService });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ ...activeCourse, category, teacher }]);
    });

    test("Debería lanzar error si no hay cursos activos", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([]);

        await expect(
            getActiveCourses({ courseService, categoryService, userService })
        ).rejects.toThrowError("No se encontraron cursos activos");
    });

    test("Debería devolver curso activo aunque falte docente o categoría", async () => {
        const courseService = new MockedCourseService([activeCourse]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([]);

        const result = await getActiveCourses({ courseService, categoryService, userService });

        expect(result).toEqual([{ ...activeCourse, category: undefined, teacher: undefined }]);
    });
});
