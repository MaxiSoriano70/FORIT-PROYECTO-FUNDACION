import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { getUserByEmail } from "./get-user-find-by-email";

describe("Buscar usuario por email", () => {
    const users = [
        userMock({ id: "1", firstName: "Juan", lastName: "Pérez", email: "juan@example.com" }),
        userMock({ id: "2", firstName: "María", lastName: "Gómez", email: "maria@example.com" }),
    ];

    test("Debería devolver el usuario con el email indicado", async () => {
        const userService = new MockedUserService(users);
        const spyFindByEmail = vi.spyOn(userService, "findByEmail");

        const result = await getUserByEmail({ userService }, "maria@example.com");

        expect(spyFindByEmail).toHaveBeenCalledTimes(1);
        expect(spyFindByEmail).toHaveBeenCalledWith("maria@example.com");
        expect(result).toEqual(users[1]);
    });

    test("Debería devolver undefined si el email no existe", async () => {
        const userService = new MockedUserService(users);

        const result = await getUserByEmail({ userService }, "otro@example.com");

        expect(result).toBeUndefined();
    });
});
