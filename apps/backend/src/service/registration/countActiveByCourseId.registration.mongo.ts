import mongoose from "mongoose";
import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";

export async function countActiveByCourseId(
    courseId: string | mongoose.Types.ObjectId
): Promise<number> {
    return await registrationManager.countActiveByCourseId(courseId.toString());
}
