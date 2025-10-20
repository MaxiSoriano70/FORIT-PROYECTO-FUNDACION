import { User } from "../entities";

export interface AuthService{
    register(data: Omit<User, "id" | "role">): Promise<User>;
    login(email: string, password: string): Promise<User>;
}