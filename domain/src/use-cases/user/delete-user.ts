import { UserService } from "../../services";

export interface DeleteUserDeps {
    userService: UserService;
}

export async function deleteUser(id: string, deps: DeleteUserDeps) {
    return await deps.userService.deleteById(id);
}
