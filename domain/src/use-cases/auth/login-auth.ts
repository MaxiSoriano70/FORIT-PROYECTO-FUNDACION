import { AuthService } from "../../services/auth-service";
import { User } from "../../entities/user";

export interface LoginUserDeps {
    authService: AuthService;
}

export async function loginUser(
    credentials: Pick<User, "email" | "password">,
    deps: LoginUserDeps
) {
    const loggedUser = await deps.authService.login(
        credentials.email,
        credentials.password
    );

    return loggedUser;
}
