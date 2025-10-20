import { describe, test, expect, vi } from "vitest";
import { UserRole } from "../../utils/enums/userRole";
import { MockedAuthService } from "../../services/mocks/mock-auth-service";
import { registerUser } from "./register-auth";

describe("Registrar usuario", () => {
    const users = [
        {
            id: "1",
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "1234",
            phone: "123456789",
            address: "Av. Siempre Viva 123",
            role: UserRole.STUDENT,
        },
    ];

    test("Debería registrar un nuevo usuario correctamente", async () => {
        const authService = new MockedAuthService(users);
        const spyRegister = vi.spyOn(authService, "register");

        const newUserData = {
            firstName: "María",
            lastName: "Gómez",
            email: "maria@example.com",
            password: "abcd",
            phone: "987654321",
            address: "Calle Falsa 456",
        };

        const result = await registerUser(newUserData, { authService });

        expect(spyRegister).toHaveBeenCalledTimes(1);
        expect(spyRegister).toHaveBeenCalledWith(newUserData);
        expect(result).toHaveProperty("id");
        expect(result.firstName).toBe("María");
        expect(result.role).toBe(UserRole.STUDENT);

        const allUsers = (authService as any).users;
        expect(allUsers).toHaveLength(2);
    });

    test("Debería lanzar error si el email ya está registrado", async () => {
        const authService = new MockedAuthService(users);
        const existingEmailData = {
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "1234",
            phone: "555555555",
            address: "Otra dirección",
        };

        await expect(registerUser(existingEmailData, { authService }))
            .rejects
            .toThrowError("El email ya está registrado");
    });
});
