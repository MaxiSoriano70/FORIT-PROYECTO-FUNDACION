import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { getRegistrationFindCourseById } from "./get-registration-find-by-course-id";

describe("Obtener información de curso con cantidad de inscripciones", () => {
    const course = courseMock({
        id: "course1",
        name: "React Avanzado",
    });

    const registrations = [
        registrationMock({ id: "reg1", courseId: "course1", studentId: "s1" }),
        registrationMock({ id: "reg2", courseId: "course1", studentId: "s2" }),
    ];

    test("Debería devolver el nombre del curso y cantidad de alumnos inscriptos", async () => {
        const registrationService = new MockedRegistrationService(registrations);
        const courseService = new MockedCourseService([course]);

        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindByCourseId = vi.spyOn(registrationService, "findByCourseId");

        const result = await getRegistrationFindCourseById("course1", {
            registrationService,
            courseService,
        });

        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindByCourseId).toHaveBeenCalledWith("course1");

        expect(result).toEqual({
            courseId: "course1",
            courseName: "React Avanzado",
            studentCount: 2,
        });
    });

    test("Debería devolver 0 si no hay inscripciones para el curso", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([course]);

        const result = await getRegistrationFindCourseById("course1", {
            registrationService,
            courseService,
        });

        expect(result).toEqual({
            courseId: "course1",
            courseName: "React Avanzado",
            studentCount: 0,
        });
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService(registrations);
        const courseService = new MockedCourseService([]);

        await expect(
            getRegistrationFindCourseById("course1", {
                registrationService,
                courseService,
            })
        ).rejects.toThrow("El curso no existe");
    });
});
