import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { IUser } from "../../data/mongo/models/user.model.js";
import { Document, UpdateQuery } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function updateUserById(
    id: string,
    data: UpdateQuery<IUser>
): Promise<Lean<IUser> | null> {
    const updated = await userManager.editOne(id, data);
    return updated;
}
