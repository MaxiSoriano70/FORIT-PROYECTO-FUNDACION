import { UserService } from "../../services";

export interface GetUserByIdDeps {
    userService: UserService;
}

export async function getUserById(deps: GetUserByIdDeps, id: string) {
    return await deps.userService.findById(id);
}
