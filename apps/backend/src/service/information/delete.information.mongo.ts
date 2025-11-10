import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { IInformation } from "../../data/mongo/models/information.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function deleteInformation(id: string): Promise<Lean<IInformation> | null> {
    const deletedInfo = await informationManager.deleteById(id);
    return deletedInfo;
}
