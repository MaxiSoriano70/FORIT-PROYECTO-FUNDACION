import bcrypt from "bcryptjs";
import { userManager } from "../user/user.manager.js";
import { IUser } from "../../models/user.model.js";
import { UserRole } from "../../../../utils/enums/userRole.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

class AuthManager {
    register = async (data: RegisterData): Promise<Lean<IUser>> => {
        const existingUser = await userManager.findByEmail(data.email);
        if (existingUser) throw new Error("El email ya está registrado");

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await userManager.save({
            ...data,
            password: hashedPassword,
            role: UserRole.STUDENT,
        });

        if (typeof (newUser as any).toObject === "function") {
            return (newUser as any).toObject() as Lean<IUser>;
        }

        return newUser as Lean<IUser>;
    };

    login = async (email: string, password: string): Promise<Lean<IUser>> => {
        const user = await userManager.findByEmail(email);
        if (!user) throw new Error("Usuario no encontrado");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Contraseña incorrecta");

        return user;
    };
}

const authManager = new AuthManager();

export { authManager };
export default AuthManager;
