import mongoose from "mongoose";
import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";

export async function isStudentRegistered(
    courseId: string | mongoose.Types.ObjectId,
    studentId: string | mongoose.Types.ObjectId
): Promise<boolean> {
    return await registrationManager.isStudentRegistered(
        courseId.toString(),
        studentId.toString()
    );
}
