import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { getRegistrationList } from "./get-registration-list";

describe("Obtener lista de inscripciones", () => {
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

    test("Debería devolver las inscripciones con datos de curso y estudiante", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spyFindAll = vi.spyOn(registrationService, "findAll");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const result = await getRegistrationList({ registrationService, courseService, userService });

        expect(spyFindAll).toHaveBeenCalledTimes(1);
        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");

        expect(result).toEqual([
            {
                ...registration,
                course: { id: course.id, name: course.name },
                student: {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                },
            },
        ]);
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student]);

        await expect(getRegistrationList({ registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Curso con id ${registration.courseId} no encontrado para la inscripción ${registration.id}`);
    });

    test("Debería lanzar error si el estudiante no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(getRegistrationList({ registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Estudiante con id ${registration.studentId} no encontrado para la inscripción ${registration.id}`);
    });

    test("Debería devolver lista vacía si no hay inscripciones", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const result = await getRegistrationList({ registrationService, courseService, userService });
        expect(result).toEqual([]);
    });
});
