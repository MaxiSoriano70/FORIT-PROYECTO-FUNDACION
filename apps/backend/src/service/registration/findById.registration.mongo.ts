import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";
import { Document, Types } from "mongoose";

type Lean<T> = Omit<T, Exclude<keyof Document, "_id">>;

export async function findRegistrationById(id: string | Types.ObjectId): Promise<Lean<IRegistration> | null> {
    const registration = await registrationManager.findById(id);
    return registration;
}
