import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { getRegistrationSave } from "./save-registration";


describe("Guardar inscripción", () => {
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
        studentId: "student1",
        courseId: "course1",
    });

    test("Debería guardar la inscripción y devolver datos de curso y estudiante", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spySave = vi.spyOn(registrationService, "save");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const result = await getRegistrationSave(registration, { registrationService, courseService, userService });

        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");
        expect(spySave).toHaveBeenCalledWith(registration);

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

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student]);

        await expect(getRegistrationSave(registration, { registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Curso con id ${registration.courseId} no encontrado`);
    });

    test("Debería lanzar error si el estudiante no existe", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(getRegistrationSave(registration, { registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Estudiante con id ${registration.studentId} no encontrado`);
    });

    test("Debería lanzar error si la inscripción ya existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        await expect(getRegistrationSave(registration, { registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Registration con id ${registration.id} ya existe`);
    });
});
