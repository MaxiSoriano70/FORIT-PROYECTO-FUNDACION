import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { getUserByFullName } from "./get-user-find-by-full-name";

describe("Buscar usuario por nombre y apellido", () => {
    const users = [
        userMock({ id: "1", firstName: "Juan", lastName: "Pérez" }),
        userMock({ id: "2", firstName: "María", lastName: "Gómez" }),
        userMock({ id: "3", firstName: "Juan", lastName: "Gómez" }),
    ];

    test("Debería devolver el usuario que coincida con nombre y apellido", async () => {
        const userService = new MockedUserService(users);
        const spyFindByFullName = vi.spyOn(userService, "findByFullName");

        const result = await getUserByFullName({ userService }, "Juan", "Pérez");

        expect(spyFindByFullName).toHaveBeenCalledTimes(1);
        expect(spyFindByFullName).toHaveBeenCalledWith("Juan", "Pérez");
        expect(result).toEqual(users[0]);
    });

    test("Debería devolver undefined si no existe coincidencia exacta", async () => {
        const userService = new MockedUserService(users);

        const result = await getUserByFullName({ userService }, "Pedro", "Martínez");

        expect(result).toBeUndefined();
    });
});
