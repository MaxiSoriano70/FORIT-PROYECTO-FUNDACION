import { UserService } from "../../services";

export interface GetUserByLastNameDeps {
    userService: UserService;
}

export async function getUserByLastName(deps: GetUserByLastNameDeps, lastName: string) {
    return await deps.userService.findByLastName(lastName);
}
