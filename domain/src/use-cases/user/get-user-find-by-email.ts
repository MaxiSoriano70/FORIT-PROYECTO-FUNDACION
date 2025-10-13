import { UserService } from "../../services";

export interface GetUserByEmailDeps {
    userService: UserService;
}

export async function getUserByEmail(deps: GetUserByEmailDeps, email: string) {
    return await deps.userService.findByEmail(email);
}