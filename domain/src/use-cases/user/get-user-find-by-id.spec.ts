import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { getUserById } from "./get-user-find-by-id";
import { userMock } from "../../entities/mock/user-mock";

describe("Buscar usuario por ID", () => {
    const users = [
        userMock({ id: "1", firstName: "Juan", lastName: "Pérez" }),
        userMock({ id: "2", firstName: "María", lastName: "Gómez" }),
    ];

    test("Debería devolver el usuario con el ID indicado", async () => {
        const userService = new MockedUserService(users);
        const spyFindById = vi.spyOn(userService, "findById");

        const result = await getUserById({ userService }, "2");

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(spyFindById).toHaveBeenCalledWith("2");
        expect(result).toEqual(users[1]);
    });

    test("Debería devolver undefined si el ID no existe", async () => {
        const userService = new MockedUserService(users);

        const result = await getUserById({ userService }, "999");

        expect(result).toBeUndefined();
    });
});
