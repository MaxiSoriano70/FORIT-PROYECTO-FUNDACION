import { AuthService } from "../auth-service";
import { User } from "../../entities/user";
import { UserRole } from "../../utils/enums/userRole";

export class MockedAuthService implements AuthService {
    private users: User[] = [];

    constructor(users: User[] = []) {
        this.users = users;
    }

    register = async (data: Omit<User, "id" | "role">): Promise<User> => {
        const exists = this.users.some(
            u => u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (exists) {
            throw new Error("El email ya está registrado");
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            role: UserRole.STUDENT,
            ...data,
        };

        this.users.push(newUser);
        return newUser;
    };

    login = async (email: string, password: string): Promise<User> => {
        const user = this.users.find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (user.password !== password) {
            throw new Error("Contraseña incorrecta");
        }

        return user;
    };
}
