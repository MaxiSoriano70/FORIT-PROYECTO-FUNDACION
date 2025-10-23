
import bcrypt from "bcryptjs";
import { userManager } from "../user/user.manager.js";

class AuthManager {
    register = async (data) => {
        const existingUser = await userManager.findBy({ email: data.email });
        if (existingUser) throw new Error("El email ya está registrado");

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await usersManager.save({
            ...data,
            password: hashedPassword,
            role: "ESTUDIANTE"
        });

        return newUser;
    };

    login = async (email, password) => {
        const user = await usersManager.findBy({ email });
        if (!user) throw new Error("Usuario no encontrado");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Contraseña incorrecta");

        return user;
    };
}

const authManager = new AuthManager();
export { authManager };
export default AuthManager;
