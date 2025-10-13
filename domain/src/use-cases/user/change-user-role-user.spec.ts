import { describe, expect, test, vi } from "vitest";
import { MockedUserService } from "../../services/mocks/mock-user-service";
import { userMock } from "../../entities/mock/user-mock";
import { UserRole } from "../../utils/enums/userRole";
import { changeUserRoleUser } from "./change-user-role-user";

describe("Cambiar rol de usuario", () => {
    const users = [
        userMock({
            id: "1",
            firstName: "Juan",
            email: "juan@example.com",
            role: UserRole.STUDENT
        }),
    ];

    test("Debería cambiar el rol del usuario correctamente", async () => {
        const userService = new MockedUserService([...users]);
        const spyChangeRole = vi.spyOn(userService, "changeRole");
        const newRole = UserRole.ADMIN;
        const userId = "1";

        const updatedUser = await changeUserRoleUser(userId, newRole, { userService });

        expect(spyChangeRole).toHaveBeenCalledTimes(1);
        expect(spyChangeRole).toHaveBeenCalledWith(userId, newRole);

        expect(updatedUser).toBeDefined();
        expect(updatedUser!.id).toBe(userId);
        expect(updatedUser!.role).toBe(newRole);

        const userInStorage = await userService.findById(userId);
        expect(userInStorage!.role).toBe(newRole);
    });

    test("Debería lanzar un error si el usuario no existe", async () => {
        const userService = new MockedUserService([...users]);
        const newRole = UserRole.ADMIN;
        const nonExistentId = "999";

        await expect(changeUserRoleUser(nonExistentId, newRole, { userService }))
            .rejects
            .toThrowError(`Usuario con id ${nonExistentId} no encontrado`);
    });
});