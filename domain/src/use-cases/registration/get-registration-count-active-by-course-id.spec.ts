import { describe, test, expect, vi } from "vitest";
import { courseMock, registrationMock, userMock } from "../../entities/mock";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { getRegistrationCountActiveByCourseId } from "./get-registration-count-active-by-course-id";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";

describe("Obtener la cantidad de alumnos activos por curso", () => {
    const course = courseMock({
        id: "course1",
        name: "JavaScript Avanzado",
    });

    const student1 = userMock({
        id: "student1",
        firstName: "Juan",
        lastName: "Pérez",
    });

    const student2 = userMock({
        id: "student2",
        firstName: "Ana",
        lastName: "Gómez",
    });

    const registration1 = registrationMock({
        id: "reg1",
        courseId: "course1",
        studentId: "student1",
        status: RegistrationStatus.ACTIVO,
    });

    const registration2 = registrationMock({
        id: "reg2",
        courseId: "course1",
        studentId: "student2",
        status: RegistrationStatus.ACTIVO,
    });

    const registration3 = registrationMock({
        id: "reg3",
        courseId: "course1",
        studentId: "student2",
        status: RegistrationStatus.ABANDONADO,
    });

    test("Debería devolver la cantidad de alumnos activos y sus nombres", async () => {
        const registrationService = new MockedRegistrationService([registration1, registration2, registration3]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student1, student2]);

        const spyCountActive = vi.spyOn(registrationService, "countActiveByCourseId");
        const spyFindByCourse = vi.spyOn(registrationService, "findByCourseId");
        const spyFindCourse = vi.spyOn(courseService, "findById");
        const spyFindUser1 = vi.spyOn(userService, "findById");

        const result = await getRegistrationCountActiveByCourseId("course1", {
            registrationService,
            courseService,
            userService,
        });

        expect(spyCountActive).toHaveBeenCalledWith("course1");
        expect(spyFindByCourse).toHaveBeenCalledWith("course1");
        expect(spyFindCourse).toHaveBeenCalledWith("course1");
        expect(spyFindUser1).toHaveBeenCalledWith("student1");
        expect(result).toEqual({
            courseId: "course1",
            courseName: "JavaScript Avanzado",
            studentCount: 2,
            students: [
                { id: "student1", name: "Juan Pérez" },
                { id: "student2", name: "Ana Gómez" },
            ],
        });
    });

    test("Debería lanzar error si el curso no existe", async () => {
        const registrationService = new MockedRegistrationService([registration1]);
        const courseService = new MockedCourseService([]);
        const userService = new MockedUserService([student1]);

        await expect(
            getRegistrationCountActiveByCourseId("course1", { registrationService, courseService, userService })
        ).rejects.toThrow("El curso no existe");
    });

    test("Debería lanzar error si no hay alumnos activos", async () => {
        const registrationService = new MockedRegistrationService([
            registrationMock({ ...registration1, status: RegistrationStatus.ABANDONADO })
        ]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([student1]);

        await expect(
            getRegistrationCountActiveByCourseId("course1", { registrationService, courseService, userService })
        ).rejects.toThrow("El curso no tiene alumnos activos");
    });

    test("Debería lanzar error si algún estudiante activo no existe", async () => {
        const registrationService = new MockedRegistrationService([registration1]);
        const courseService = new MockedCourseService([course]);
        const userService = new MockedUserService([]);

        await expect(
            getRegistrationCountActiveByCourseId("course1", { registrationService, courseService, userService })
        ).rejects.toThrow(`Estudiante con id ${registration1.studentId} no encontrado en el curso ${course.name}`);
    });
});
