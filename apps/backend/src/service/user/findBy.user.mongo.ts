import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { IUser } from "../../data/mongo/models/user.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function findUserByEmail(email: string): Promise<Lean<IUser> | null> {
    const user = await userManager.findBy({ email });
    return user;
}
