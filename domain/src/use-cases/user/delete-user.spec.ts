import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { deleteUser } from "./delete-user";

describe("Eliminar usuario existente", () => {
    const users = [
        userMock({ id: "1", firstName: "Juan", lastName: "Pérez", email: "juan@example.com" }),
        userMock({ id: "2", firstName: "María", lastName: "Gómez", email: "maria@example.com" }),
    ];

    test("Debería eliminar el usuario correctamente", async () => {
        const userService = new MockedUserService([...users]);
        const spyDelete = vi.spyOn(userService, "deleteById");

        await deleteUser("1", { userService });

        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(spyDelete).toHaveBeenCalledWith("1");

        const allUsers = await userService.findAll();
        expect(allUsers).toHaveLength(1);
        expect(allUsers[0]!.id).toBe("2");
    });

    test("Debería lanzar un error si el usuario no existe", async () => {
        const userService = new MockedUserService([...users]);

        await expect(deleteUser("999", { userService }))
            .rejects
            .toThrowError("Usuario con id 999 no encontrado");
    });
});
