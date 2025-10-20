import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { updateRegistrationFinishCourse } from "./update-registration-finish-course";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";

describe("Finalizar curso de inscripción", () => {
    const course = courseMock({ id: "course1", name: "JavaScript Avanzado" });
    const student = userMock({ id: "student1", firstName: "Juan", lastName: "Pérez" });
    const registration = registrationMock({ id: "reg1", studentId: "student1", courseId: "course1" });

    test("Debería marcar el curso como completado y devolver datos completos", async () => {
        const completionDate = new Date("2025-10-19T12:00:00Z");

        const registrationService = new MockedRegistrationService([registration]);
        vi.spyOn(registrationService, "finishCourse").mockImplementation(async (id) => ({
            ...registration,
            courseFinished: true,
            status: RegistrationStatus.COMPLETADO,
            completionDate,
        }));

        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spyFinish = vi.spyOn(registrationService, "finishCourse");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const result = await updateRegistrationFinishCourse("reg1", { registrationService, courseService, userService });

        expect(spyFinish).toHaveBeenCalledWith("reg1");
        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");

        expect(result.courseFinished).toBe(true);
        expect(result.status).toBe(RegistrationStatus.COMPLETADO);
        expect(result.course).toEqual({ id: course.id, name: course.name });
        expect(result.student).toEqual({ id: student.id, firstName: student.firstName, lastName: student.lastName });
        expect(result.completionDate).toEqual(completionDate);
    });

    test("Debería lanzar error si la inscripción no existe", async () => {
        const registrationService = new MockedRegistrationService([]);
        vi.spyOn(registrationService, "finishCourse").mockRejectedValue(new Error("Registration con id regX no encontrado"));
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        await expect(updateRegistrationFinishCourse("regX", { registrationService, courseService, userService }))
            .rejects
            .toThrowError("Registration con id regX no encontrado");
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        vi.spyOn(registrationService, "finishCourse").mockResolvedValue({
            ...registration,
            courseFinished: true,
            status: RegistrationStatus.COMPLETADO,
            completionDate: new Date(),
        });
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student]);

        await expect(updateRegistrationFinishCourse("reg1", { registrationService, courseService, userService }))
            .rejects
            .toThrowError("Curso con id course1 no encontrado");
    });

    test("Debería lanzar error si el estudiante no existe", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        vi.spyOn(registrationService, "finishCourse").mockResolvedValue({
            ...registration,
            courseFinished: true,
            status: RegistrationStatus.COMPLETADO,
            completionDate: new Date(),
        });
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(updateRegistrationFinishCourse("reg1", { registrationService, courseService, userService }))
            .rejects
            .toThrowError("Estudiante con id student1 no encontrado");
    });
});
