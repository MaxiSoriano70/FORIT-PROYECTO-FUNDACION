import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { saveUser } from "./save-user";

describe("Guardar usuario", () => {
    const users = [
        userMock({
            id: "1",
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "1234",
            phone: "123456789",
            address: "Av. Siempre Viva 123",
            role: "ESTUDIANTE",
        }),
    ];

    test("Debería guardar un nuevo usuario", async () => {
        const userService = new MockedUserService(users);
        const spySave = vi.spyOn(userService, "save");

        const newUser = userMock({
            id: "2",
            firstName: "María",
            lastName: "Gómez",
            email: "maria@example.com",
            password: "abcd",
            phone: "987654321",
            address: "Calle Falsa 456",
            role: "ADMIN",
        });

        await saveUser(newUser, { userService });

        expect(spySave).toHaveBeenCalledTimes(1);
        expect(spySave).toHaveBeenCalledWith(newUser);

        const allUsers = await userService.findAll();
        expect(allUsers).toHaveLength(2);
        expect(allUsers[1]!.firstName).toBe("María");
    });

    test("Debería lanzar error si el usuario ya existe", async () => {
        const userService = new MockedUserService(users);
        const existingUser = users[0];
        if (!existingUser) throw new Error("No hay usuarios para testear");

        await expect(saveUser(existingUser, { userService }))
            .rejects
            .toThrowError(`Usuario con id ${existingUser.id} ya existe`);
    });
});
