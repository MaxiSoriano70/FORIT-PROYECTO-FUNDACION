import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { IUser } from "../../data/mongo/models/user.model.js";

export async function saveUser(user: IUser) {
    const existing = await userManager.findByEmail(user.email);
    if (existing) {
        throw new Error(`El usuario con email "${user.email}" ya existe`);
    }

    const newUser = await userManager.save(user);
    return newUser;
}
