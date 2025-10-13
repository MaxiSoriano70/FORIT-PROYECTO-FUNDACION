import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { getUserList } from "../../use-cases/user/get-user-list";
import { userMock } from "../../entities/mock/user-mock";

describe("Traer todos los usuarios", () => {
    const users = [
        userMock({
            id: "1",
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "1234",
            phone: "123456789",
            address: "Av. Siempre Viva 742",
            role: "ADMIN",
        }),
        userMock({
            id: "2",
            firstName: "María",
            lastName: "Gómez",
            email: "maria@example.com",
            password: "5678",
            phone: "987654321",
            address: "Calle Falsa 123",
            role: "ESTUDIANTE",
        }),
    ];

    test("Debería devolver todos los usuarios", async () => {
        const userService = new MockedUserService(users);
        const spyFindAll = vi.spyOn(userService, "findAll");

        const result = await getUserList({ userService });

        expect(spyFindAll).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(users.length);
        expect(result).toEqual(users);
    });
});
