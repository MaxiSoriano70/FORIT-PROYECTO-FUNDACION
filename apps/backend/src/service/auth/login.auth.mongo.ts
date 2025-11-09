import { authManager } from "../../data/mongo/managers/auth/auth.manager.js";
import { IUser } from "../../data/mongo/models/user.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function login(
    email: string,
    password: string
): Promise<Lean<IUser>> {
    return await authManager.login(email, password);
}
