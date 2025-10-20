import { describe, test, expect, vi } from "vitest";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { MockedCourseService } from "../../services/mocks/mock-course-service";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { UserRole } from "../../utils/enums/userRole";
import { registrationMock } from "../../entities/mock/registration-mock";
import { userMock } from "../../entities/mock/user-mock";
import { courseMock } from "../../entities/mock/course-mock";
import { getRegistrationFindStudentById } from "./get-registration-find-by-student-id";

describe("getRegistrationFindStudentById", () => {
    test("debería devolver las inscripciones con nombre del curso y nombre del estudiante", async () => {
        const student = userMock({
            id: "s2",
            firstName: "Ana",
            lastName: "Pérez",
            role: UserRole.STUDENT,
        });

        const course = courseMock({
            id: "c1",
            name: "Java Avanzado",
        });

        const registration = registrationMock({
            id: "r1",
            studentId: "s2",
            courseId: "c1",
        });

        const deps = {
            registrationService: new MockedRegistrationService([registration]),
            courseService: new MockedCourseService([course]),
            userService: new MockedUserService([student]),
        };

        const result = await getRegistrationFindStudentById("s2", deps);

        expect(result).toHaveLength(1);
        expect(result[0]!.courseName).toBe("Java Avanzado");
        expect(result[0]!.studentName).toBe("Ana Pérez");
    });

    test("debería lanzar error si el usuario no existe", async () => {
        const deps = {
            registrationService: new MockedRegistrationService([]),
            courseService: new MockedCourseService([]),
            userService: new MockedUserService([]),
        };

        await expect(getRegistrationFindStudentById("s999", deps)).rejects.toThrow(
            "El usuario no existe"
        );
    });

    test("debería lanzar error si el usuario no es estudiante", async () => {
        const teacher = userMock({
            id: "t1",
            firstName: "Carlos",
            lastName: "Gómez",
            role: UserRole.TEACHER,
        });

        const deps = {
            registrationService: new MockedRegistrationService([]),
            courseService: new MockedCourseService([]),
            userService: new MockedUserService([teacher]),
        };

        await expect(getRegistrationFindStudentById("t1", deps)).rejects.toThrow(
            "El usuario no es un estudiante"
        );
    });

    test("debería lanzar error si el alumno no tiene inscripciones", async () => {
        const student = userMock({
            id: "s3",
            firstName: "Lucía",
            lastName: "Torres",
            role: UserRole.STUDENT,
        });

        const deps = {
            registrationService: new MockedRegistrationService([]),
            courseService: new MockedCourseService([]),
            userService: new MockedUserService([student]),
        };

        await expect(getRegistrationFindStudentById("s3", deps)).rejects.toThrow(
            "El alumno no tiene inscripciones registradas"
        );
    });
});
