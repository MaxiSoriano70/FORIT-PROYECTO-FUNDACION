import { AuthService } from "../../services/auth-service";
import { User } from "../../entities/user";

export interface RegisterUserDeps {
    authService: AuthService;
}

export async function registerUser(
    user: Omit<User, "id" | "role">,
    deps: RegisterUserDeps
) {
    const newUser = await deps.authService.register(user);
    return newUser;
}
