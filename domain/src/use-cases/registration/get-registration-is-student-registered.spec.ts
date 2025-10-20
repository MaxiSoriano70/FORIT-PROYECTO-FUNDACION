import { describe, test, expect, vi } from "vitest";
import { courseMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { registrationIsStudentRegistered } from "./get-registration-is-student-registered";

describe("Verificar si un estudiante está inscrito en un curso", () => {
    const course = courseMock({ id: "course1", name: "JavaScript Avanzado" });
    const student = userMock({ id: "student1", firstName: "Juan", lastName: "Pérez" });

    test("Debería devolver true si el alumno está registrado", async () => {
        const registrationService = new MockedRegistrationService([]);
        registrationService.isStudentRegistered = async () => true;

        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const spyIsRegistered = vi.spyOn(registrationService, "isStudentRegistered");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser = vi.spyOn(userService, "findById");

        const result = await registrationIsStudentRegistered("course1", "student1", {
            registrationService,
            courseService,
            userService,
        });

        expect(spyIsRegistered).toHaveBeenCalledWith("course1", "student1");
        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser).toHaveBeenCalledWith("student1");
        expect(result).toBe(true);
    });

    test("Debería devolver false si el alumno no está registrado", async () => {
        const registrationService = new MockedRegistrationService([]);
        registrationService.isStudentRegistered = async () => false;

        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student]);

        const result = await registrationIsStudentRegistered("course1", "student1", {
            registrationService,
            courseService,
            userService,
        });

        expect(result).toBe(false);
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student]);

        await expect(
            registrationIsStudentRegistered("course1", "student1", {
                registrationService,
                courseService,
                userService,
            })
        ).rejects.toThrow("El curso no existe");
    });

    test("Debería lanzar error si el alumno no existe", async () => {
        const registrationService = new MockedRegistrationService([]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(
            registrationIsStudentRegistered("course1", "student1", {
                registrationService,
                courseService,
                userService,
            })
        ).rejects.toThrow("El alumno no existe");
    });
});
