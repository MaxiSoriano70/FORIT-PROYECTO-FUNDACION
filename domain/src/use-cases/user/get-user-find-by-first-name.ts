import { UserService } from "../../services";

export interface GetUserByFirstNameDeps {
    userService: UserService;
}

export async function getUserByFirstName(deps: GetUserByFirstNameDeps, firstName: string) {
    return await deps.userService.findByFirstName(firstName);
}
