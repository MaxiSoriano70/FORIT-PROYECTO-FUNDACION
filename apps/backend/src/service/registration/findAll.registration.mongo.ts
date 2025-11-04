import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function findAllRegistrations(): Promise<Lean<IRegistration>[]> {
    const registrations = await registrationManager.findAll();
    return registrations;
}
