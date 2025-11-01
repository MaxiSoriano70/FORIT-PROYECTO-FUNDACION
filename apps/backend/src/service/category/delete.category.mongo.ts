import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { ICategory } from "../../data/mongo/models/category.model.js";
import { Lean } from "../../data/mongo/managers/manager.mongo.js";

export async function deleteCategory(id: string): Promise<Lean<ICategory>> {
    const existing = await categoryManager.findById(id);
    if (!existing) {
        throw new Error(`La categoría con id "${id}" no existe`);
    }

    const deleted = await categoryManager.deleteById(id);
    if (!deleted) {
        throw new Error("No se pudo eliminar la categoría");
    }

    return deleted;
}
