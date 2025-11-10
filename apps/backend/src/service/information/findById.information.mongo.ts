import mongoose, { Document } from "mongoose";
import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { IInformation } from "../../data/mongo/models/information.model.js";

type Lean<T> = Omit<T, keyof Document> & { _id: mongoose.Types.ObjectId };

export async function findInformationById(id: string): Promise<Lean<IInformation>> {
    const info = await informationManager.findById(id);
    if (!info) {
        throw new Error(`La solicitud de información con id "${id}" no existe`);
    }
    return info as Lean<IInformation>;
}
