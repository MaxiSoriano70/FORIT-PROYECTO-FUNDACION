import { userManager } from "../user/user.manager.js";
import { IUser } from "../../models/user.model.js";
import { Document } from "mongoose";
import bcrypt from 'bcryptjs';

type Lean<T> = Omit<T, keyof Document>;

class AuthManager {
    login = async (email: string, password: string): Promise<Lean<IUser>> => {
        const user = await userManager.findByEmail(email);
        if (!user) throw new Error("Usuario no encontrado");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Contraseña incorrecta");
        }

        return user;
    };
}

const authManager = new AuthManager();

export { authManager };
export default AuthManager;
