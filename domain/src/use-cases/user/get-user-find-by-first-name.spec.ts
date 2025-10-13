import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { getUserByFirstName } from "./get-user-find-by-first-name";

describe("Buscar usuario por nombre", () => {
    const users = [
        userMock({ id: "1", firstName: "Juan", lastName: "Pérez" }),
        userMock({ id: "2", firstName: "María", lastName: "Gómez" }),
    ];

    test("Debería devolver el usuario con el nombre indicado", async () => {
        const userService = new MockedUserService(users);
        const spyFindByFirstName = vi.spyOn(userService, "findByFirstName");

        const result = await getUserByFirstName({ userService }, "María");

        expect(spyFindByFirstName).toHaveBeenCalledTimes(1);
        expect(spyFindByFirstName).toHaveBeenCalledWith("María");
        expect(result).toEqual(users[1]);
    });

    test("Debería devolver undefined si el nombre no existe", async () => {
        const userService = new MockedUserService(users);

        const result = await getUserByFirstName({ userService }, "Pedro");

        expect(result).toBeUndefined();
    });
});
