import { User } from "../../entities";
import { UserService } from "../../services";

export interface SaveUserDeps {
    userService: UserService;
}

export async function saveUser(user: User, deps: SaveUserDeps) {
    return await deps.userService.save(user);
}
