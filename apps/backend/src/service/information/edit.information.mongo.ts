import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { IInformation } from "../../data/mongo/models/information.model.js";
import { UpdateQuery } from "mongoose";

export async function editInformation(id: string, data: UpdateQuery<IInformation>) {
    if (data.courseId) {
        const course = await courseManager.findById(data.courseId.toString());
        if (!course) {
            throw new Error(`El curso con id "${data.courseId}" no existe`);
        }
    }

    const updatedInfo = await informationManager.editOne(id, data);
    return updatedInfo;
}
