import mongoose from "mongoose";
import { registrationManager, Lean } from "../../data/mongo/managers/registration/registration.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";

export async function findRegistrationsByCourseId(
    courseId: string | mongoose.Types.ObjectId
): Promise<Lean<IRegistration>[]> {
    return await registrationManager.findByCourseId(courseId.toString());
}
