import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import mongoose from "mongoose";
import { IInformation } from "../../data/mongo/models/information.model.js";

export async function saveInformation(
    data: Partial<IInformation> & { courseId: string | mongoose.Types.ObjectId }
) {
    const savedInfo = await informationManager.create(data);
    return savedInfo;
}
