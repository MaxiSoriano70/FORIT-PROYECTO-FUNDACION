import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { IInformation } from "../../data/mongo/models/information.model.js";
import { Lean } from "../../data/mongo/managers/manager.mongo.js";

export async function findAllInformation(): Promise<Lean<IInformation>[]> {
    const infos = await informationManager.findAll();
    if (!infos || infos.length === 0) {
        throw new Error("No hay solicitudes de información registradas");
    }
    return infos;
}
