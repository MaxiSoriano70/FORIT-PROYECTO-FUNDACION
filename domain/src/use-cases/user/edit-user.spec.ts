import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { updateUser } from "./edit-user";

describe("Editar usuario existente", () => {
    const users = [
        userMock({ id: "1", firstName: "Juan", lastName: "Pérez", email: "juan@example.com" }),
        userMock({ id: "2", firstName: "María", lastName: "Gómez", email: "maria@example.com" }),
    ];

    test("Debería actualizar el usuario con los nuevos datos", async () => {
        const userService = new MockedUserService(users);
        const spyEditOne = vi.spyOn(userService, "editOne");

        const result = await updateUser(
            "1",
            { firstName: "Juanito", email: "juanito@example.com" },
            { userService }
        );

        expect(spyEditOne).toHaveBeenCalledTimes(1);
        expect(spyEditOne).toHaveBeenCalledWith("1", {
            firstName: "Juanito",
            email: "juanito@example.com",
        });
        expect(result.firstName).toBe("Juanito");
        expect(result.email).toBe("juanito@example.com");
    });

    test("Debería lanzar error si el usuario no existe", async () => {
        const userService = new MockedUserService(users);

        await expect(
            updateUser("999", { firstName: "Fake" }, { userService })
        ).rejects.toThrowError("Usuario con id 999 no encontrado");
    });
});
