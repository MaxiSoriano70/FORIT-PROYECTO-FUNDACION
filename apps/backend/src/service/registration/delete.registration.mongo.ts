import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";
import { Document, Types } from "mongoose";

type Lean<T> = Omit<T, Exclude<keyof Document, "_id">>;

export async function deleteRegistration(id: string): Promise<Lean<IRegistration> | null> {
    const deleted = await registrationManager.deleteById(id);
    return deleted;
}
