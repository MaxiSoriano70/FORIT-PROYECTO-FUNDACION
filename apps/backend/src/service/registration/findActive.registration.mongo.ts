import { registrationManager, Lean } from "../../data/mongo/managers/registration/registration.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";

export async function findActive(): Promise<Lean<IRegistration>[]> {
    return await registrationManager.findActive();
}
