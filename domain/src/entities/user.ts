import { UserRole } from "../utils/enums/userRole.js";
import type { Entity } from "../utils/types/entity.js";

export interface User extends Entity{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: UserRole
}

export type SecureUser = Omit<User, "password">;