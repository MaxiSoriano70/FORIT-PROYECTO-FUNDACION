import { describe, test, expect, vi } from "vitest";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { courseMock } from "../../entities/mock/course-mock";
import { deleteCourse } from "./delete-course";

describe("Eliminar curso", () => {
    const course = courseMock({
        id: "course1",
        name: "React Avanzado",
        categoryId: "cat1",
        teacherId: "teacher1"
    });

    test("Debería eliminar un curso existente", async () => {
        const courseService = new MockedCourseService([course]);
        const spyDelete = vi.spyOn(courseService, "deleteById");

        await deleteCourse("course1", { courseService });

        const allCourses = await courseService.findAll();

        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(spyDelete).toHaveBeenCalledWith("course1");
        expect(allCourses.length).toBe(0);
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const courseService = new MockedCourseService([]);

        await expect(deleteCourse("noExiste", { courseService }))
            .rejects
            .toThrowError("Curso con id noExiste no encontrado");
    });
});
