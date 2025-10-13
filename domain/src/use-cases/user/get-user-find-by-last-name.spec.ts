import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { getUserByLastName } from "./get-user-find-by-last-name";

describe("Buscar usuario por apellido", () => {
    const users = [
        userMock({ id: "1", firstName: "Juan", lastName: "Pérez" }),
        userMock({ id: "2", firstName: "María", lastName: "Gómez" }),
    ];

    test("Debería devolver el usuario con el apellido indicado", async () => {
        const userService = new MockedUserService(users);
        const spyFindByLastName = vi.spyOn(userService, "findByLastName");

        const result = await getUserByLastName({ userService }, "Pérez");

        expect(spyFindByLastName).toHaveBeenCalledTimes(1);
        expect(spyFindByLastName).toHaveBeenCalledWith("Pérez");
        expect(result).toEqual(users[0]);
    });

    test("Debería devolver undefined si el apellido no existe", async () => {
        const userService = new MockedUserService(users);

        const result = await getUserByLastName({ userService }, "Rodríguez");

        expect(result).toBeUndefined();
    });
});
