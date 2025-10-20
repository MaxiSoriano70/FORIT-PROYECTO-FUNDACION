import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";

import { updateRegistrationQuotaPaid } from "./update-registration-mark-quota-paid";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";

describe("Actualizar cuotas pagadas de inscripción", () => {
    const course = courseMock({ id: "course1", name: "JavaScript Avanzado" });
    const student = userMock({ id: "student1", firstName: "Juan", lastName: "Pérez" });

    const registration = registrationMock({
        id: "reg1",
        studentId: "student1",
        courseId: "course1",
        paidQuotas: 1,
        totalQuotas: 3,
        status: RegistrationStatus.ACTIVO,
    });

    test("Debería marcar cuota pagada y devolver datos completos", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        vi.spyOn(registrationService, "markQuotaPaid").mockImplementation(async (id, qty = 1) => ({
            ...registration,
            paidQuotas: registration.paidQuotas + qty,
            status: registration.paidQuotas + qty >= registration.totalQuotas
                ? RegistrationStatus.COMPLETADO
                : RegistrationStatus.ACTIVO,
        }));

        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spyMarkQuota = vi.spyOn(registrationService, "markQuotaPaid");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const result = await updateRegistrationQuotaPaid("reg1", 1, {
            registrationService,
            courseService,
            userService,
        });

        expect(spyMarkQuota).toHaveBeenCalledWith("reg1", 1);
        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");

        expect(result).toEqual({
            ...registration,
            paidQuotas: 2,
            status: RegistrationStatus.ACTIVO,
            course: { id: course.id, name: course.name },
            student: { id: student.id, firstName: student.firstName, lastName: student.lastName },
        });
    });

    test("Debería marcar última cuota y cambiar estado a COMPLETADO", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        vi.spyOn(registrationService, "markQuotaPaid").mockImplementation(async (id, qty = 1) => ({
            ...registration,
            paidQuotas: registration.totalQuotas,
            status: RegistrationStatus.COMPLETADO,
        }));

        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const result = await updateRegistrationQuotaPaid("reg1", 2, {
            registrationService,
            courseService,
            userService,
        });

        expect(result.paidQuotas).toBe(3);
        expect(result.status).toBe(RegistrationStatus.COMPLETADO);
    });

    test("Debería lanzar error si la inscripción no existe", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        await expect(
            updateRegistrationQuotaPaid("noExiste", 1, { registrationService, courseService, userService })
        ).rejects.toThrow();
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        vi.spyOn(registrationService, "markQuotaPaid").mockResolvedValue(registration);
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student]);

        await expect(
            updateRegistrationQuotaPaid("reg1", 1, { registrationService, courseService, userService })
        ).rejects.toThrow(`Curso con id ${registration.courseId} no encontrado`);
    });

    test("Debería lanzar error si el estudiante no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        vi.spyOn(registrationService, "markQuotaPaid").mockResolvedValue(registration);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(
            updateRegistrationQuotaPaid("reg1", 1, { registrationService, courseService, userService })
        ).rejects.toThrow(`Estudiante con id ${registration.studentId} no encontrado`);
    });
});
