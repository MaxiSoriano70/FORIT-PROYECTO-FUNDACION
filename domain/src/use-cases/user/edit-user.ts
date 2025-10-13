import { UserService } from "../../services";

export interface UpdateUserDeps {
    userService: UserService;
}

export async function updateUser(
    id: string,
    data: Partial<{ firstName: string; lastName: string; email: string }>,
    deps: UpdateUserDeps
) {
    return await deps.userService.editOne(id, data);
}
