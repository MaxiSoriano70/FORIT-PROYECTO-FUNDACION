import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";
import { getRegistrationFindActive } from "./get-registration-find-activo";

describe("Obtener inscripciones activas", () => {
    const course = courseMock({ id: "course1", name: "JavaScript Avanzado" });
    const student = userMock({ id: "student1", firstName: "Juan", lastName: "Pérez" });

    const registrationActivo = registrationMock({
        id: "reg1",
        studentId: "student1",
        courseId: "course1",
        status: RegistrationStatus.ACTIVO,
    });

    test("Debería devolver inscripciones activas con datos completos", async () => {
        const registrationService = new MockedRegistrationService([registrationActivo]);
        vi.spyOn(registrationService, "findActive").mockResolvedValue([registrationActivo]);

        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const result = await getRegistrationFindActive({ registrationService, courseService, userService });

        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");

        expect(result).toEqual([
            {
                ...registrationActivo,
                course: { id: course.id, name: course.name },
                student: { id: student.id, firstName: student.firstName, lastName: student.lastName },
            },
        ]);
    });

    test("Debería lanzar error si un curso no existe", async () => {
        const registrationService = new MockedRegistrationService([registrationActivo]);
        vi.spyOn(registrationService, "findActive").mockResolvedValue([registrationActivo]);

        const courseService = new MockedCourseService([]); // sin cursos
        const userService = new MockedUserService([student]);

        await expect(getRegistrationFindActive({ registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Curso con id ${registrationActivo.courseId} no encontrado para la inscripción ${registrationActivo.id}`);
    });

    test("Debería lanzar error si un estudiante no existe", async () => {
        const registrationService = new MockedRegistrationService([registrationActivo]);
        vi.spyOn(registrationService, "findActive").mockResolvedValue([registrationActivo]);

        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(getRegistrationFindActive({ registrationService, courseService, userService }))
            .rejects
            .toThrowError(`Estudiante con id ${registrationActivo.studentId} no encontrado para la inscripción ${registrationActivo.id}`);
    });
});
