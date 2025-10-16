import { describe, test, expect, vi } from "vitest";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { courseMock } from "../../entities/mock/course-mock";
import { categoryMock } from "../../entities/mock/category-mock";
import { userMock } from "../../entities/mock/user-mock";
import { getUpcomingCourses } from "./get-course-find-by-upcoming";

describe("Obtener cursos próximos a comenzar", () => {
    const category = categoryMock({ id: "cat1", name: "Diseño" });
    const teacher = userMock({ id: "teacher1", firstName: "Carlos", lastName: "López" });

    const today = new Date();
    const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const upcomingCourse = courseMock({
        id: "course1",
        name: "UX/UI Moderno",
        categoryId: "cat1",
        teacherId: "teacher1",
        startDate: futureDate,
        endDate: new Date(futureDate.getTime() + 30 * 24 * 60 * 60 * 1000),
    });

    const pastCourse = courseMock({
        id: "course2",
        name: "Diseño Básico",
        categoryId: "cat1",
        teacherId: "teacher1",
        startDate: pastDate,
        endDate: new Date(),
    });

    test("Debería devolver cursos próximos con categoría y docente", async () => {
        const courseService = new MockedCourseService([upcomingCourse, pastCourse]);
        const categoryService = new MockedCategoryService([category]);
        const userService = new MockedUserService([teacher]);

        const spy = vi.spyOn(courseService, "findUpcomingCourses");

        const result = await getUpcomingCourses({ courseService, categoryService, userService });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ ...upcomingCourse, category, teacher }]);
    });

    test("Debería lanzar error si no hay cursos próximos", async () => {
        const courseService = new MockedCourseService([]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([]);

        await expect(
            getUpcomingCourses({ courseService, categoryService, userService })
        ).rejects.toThrowError("No se encontraron cursos próximos a comenzar");
    });

    test("Debería devolver curso próximo aunque falte docente o categoría", async () => {
        const courseService = new MockedCourseService([upcomingCourse]);
        const categoryService = new MockedCategoryService([]);
        const userService = new MockedUserService([]);

        const result = await getUpcomingCourses({ courseService, categoryService, userService });

        expect(result).toEqual([{ ...upcomingCourse, category: undefined, teacher: undefined }]);
    });
});
