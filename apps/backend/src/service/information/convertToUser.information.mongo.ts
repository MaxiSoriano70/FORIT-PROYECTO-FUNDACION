import { informationManager } from "../../data/mongo/managers/information/information.manager.js";

export async function convertToUser(informationId: string) {
    return await informationManager.convertToUser(informationId);
}
