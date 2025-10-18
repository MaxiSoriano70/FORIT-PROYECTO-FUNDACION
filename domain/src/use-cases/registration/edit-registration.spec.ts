import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { registrationEdit } from "./edit-registration";

describe("Editar inscripción", () => {
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

    test("Debería editar la inscripción y devolver datos de curso y estudiante", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spyEditOne = vi.spyOn(registrationService, "editOne");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const dataUpdate = { courseFinished: true };

        const result = await registrationEdit("reg1", dataUpdate, { registrationService, courseService, userService });

        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");
        expect(spyEditOne).toHaveBeenCalledWith("reg1", dataUpdate);

        expect(result).toEqual({
            ...registration,
            ...dataUpdate,
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

        await expect(registrationEdit("noExiste", { courseFinished: true }, { registrationService, courseService, userService }))
            .rejects
            .toThrowError("Inscripción con id noExiste no encontrada");
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student]);

        await expect(registrationEdit("reg1", { courseId: "noCurso" }, { registrationService, courseService, userService }))
            .rejects
            .toThrowError("Curso con id noCurso no encontrado");
    });

    test("Debería lanzar error si el estudiante no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(registrationEdit("reg1", { studentId: "noAlumno" }, { registrationService, courseService, userService }))
            .rejects
            .toThrowError("Estudiante con id noAlumno no encontrado");
    });
});
