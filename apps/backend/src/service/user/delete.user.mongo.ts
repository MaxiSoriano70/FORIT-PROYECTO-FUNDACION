import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { IUser } from "../../data/mongo/models/user.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function deleteUserById(id: string): Promise<Lean<IUser> | null> {
    const deleted = await userManager.deleteById(id);
    return deleted;
}
