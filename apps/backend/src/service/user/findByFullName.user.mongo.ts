import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { IUser } from "../../data/mongo/models/user.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function findUserByFullName(
    firstName: string,
    lastName: string
): Promise<Lean<IUser> | null> {
    const user = await userManager.findByFullName(firstName, lastName);
    return user;
}
