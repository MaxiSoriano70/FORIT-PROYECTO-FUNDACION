import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { getRegistrationFindById } from "./get-registration-find-by-id";

describe("Obtener inscripción por ID", () => {
    const course = courseMock({
        id: "course1",
        name: "JavaScript Avanzado",
    });

    const student = userMock({
        id: "student1",
        firstName: "Juan",
        lastName: "Pérez",
    });

    const registration = registrationMock({
        id: "reg1",
        courseId: "course1",
        studentId: "student1",
    });

    test("Debería devolver la inscripción con datos de curso y estudiante", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spyFindById = vi.spyOn(registrationService, "findById");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const result = await getRegistrationFindById("reg1", { registrationService, courseService, userService });

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(spyFindById).toHaveBeenCalledWith("reg1");
        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");

        expect(result).toEqual({
            ...registration,
            course: { id: course.id, name: course.name },
            student: {
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
            },
        });
    });

    test("Debería lanzar error si la inscripción no existe", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        await expect(getRegistrationFindById("noExiste", { registrationService, courseService, userService }))
            .rejects
            .toThrowError("Inscripción con id noExiste no encontrada");
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student]);

        await expect(getRegistrationFindById("reg1", { registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Curso con id ${registration.courseId} no encontrado para la inscripción ${registration.id}`);
    });

    test("Debería lanzar error si el estudiante no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(getRegistrationFindById("reg1", { registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Estudiante con id ${registration.studentId} no encontrado para la inscripción ${registration.id}`);
    });
});
