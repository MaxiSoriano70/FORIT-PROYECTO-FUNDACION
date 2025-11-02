import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { IUser } from "../../data/mongo/models/user.model.js";
import { Document } from "mongoose";
import { UserRole } from "../../utils/enums/userRole.js";

type Lean<T> = Omit<T, keyof Document>;

export async function changeUserRole(
    userId: string,
    newRole: UserRole
): Promise<Lean<IUser> | null> {
    const updatedUser = await userManager.changeRole(userId, newRole);
    return updatedUser;
}
