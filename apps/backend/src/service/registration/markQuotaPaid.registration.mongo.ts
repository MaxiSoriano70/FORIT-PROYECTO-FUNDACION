import mongoose from "mongoose";
import { registrationManager, Lean } from "../../data/mongo/managers/registration/registration.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";

export async function markQuotaPaid(
    registrationId: string | mongoose.Types.ObjectId,
    quantity = 1
): Promise<Lean<IRegistration>> {
    return await registrationManager.markQuotaPaid(registrationId.toString(), quantity);
}
