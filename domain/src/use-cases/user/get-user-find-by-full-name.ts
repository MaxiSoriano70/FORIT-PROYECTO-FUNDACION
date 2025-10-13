import { UserService } from "../../services";

export interface GetUserByFullNameDeps {
    userService: UserService;
}

export async function getUserByFullName(deps: GetUserByFullNameDeps, firstName: string, lastName: string) {
    return await deps.userService.findByFullName(firstName, lastName);
}
