import { UserRole } from "../enums/userRole";

export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: UserRole;
    profileImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
