import { UserService } from "../../services";
import { UserRole } from "../../utils/enums/userRole";

export interface ChangeUserRoleUserDeps {
    userService: UserService;
}

export async function changeUserRoleUser(
    id: string,
    newRole: string | UserRole,
    deps: ChangeUserRoleUserDeps
) {
    return await deps.userService.changeRole(id, newRole);
}