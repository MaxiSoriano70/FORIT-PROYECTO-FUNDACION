import { describe, test, expect, vi } from "vitest";
import { UserRole } from "../../utils/enums/userRole";
import { User } from "../../entities/user";
import { MockedAuthService } from "../../services/mocks/mock-auth-service";
import { loginUser } from "./login-auth";

describe("Login de usuario", () => {
    const users: User[] = [
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

    test("Debería iniciar sesión correctamente con credenciales válidas", async () => {
        const authService = new MockedAuthService(users);
        const spyLogin = vi.spyOn(authService, "login");

        const credentials = { email: "juan@example.com", password: "1234" };
        const result = await loginUser(credentials, { authService });

        expect(spyLogin).toHaveBeenCalledTimes(1);
        expect(spyLogin).toHaveBeenCalledWith("juan@example.com", "1234");
        expect(result.email).toBe("juan@example.com");
        expect(result.role).toBe(UserRole.STUDENT);
    });

    test("Debería lanzar error si el usuario no existe", async () => {
        const authService = new MockedAuthService(users);
        const credentials = { email: "noexiste@example.com", password: "1234" };

        await expect(loginUser(credentials, { authService }))
            .rejects
            .toThrowError("Usuario no encontrado");
    });

    test("Debería lanzar error si la contraseña es incorrecta", async () => {
        const authService = new MockedAuthService(users);
        const credentials = { email: "juan@example.com", password: "wrongpass" };

        await expect(loginUser(credentials, { authService }))
            .rejects
            .toThrowError("Contraseña incorrecta");
    });
});
