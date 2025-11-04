import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, Exclude<keyof Document, "_id">>;

export async function findRegistrationsByStudentId(studentId: string): Promise<Lean<IRegistration>[]> {
    const registrations = await registrationManager.findByStudentId(studentId);
    return registrations;
}
