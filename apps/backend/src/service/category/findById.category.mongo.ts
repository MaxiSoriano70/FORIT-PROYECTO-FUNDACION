import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { ICategory } from "../../data/mongo/models/category.model.js";
import { Lean } from "../../data/mongo/managers/manager.mongo.js";

export async function findCategoryById(id: string): Promise<Lean<ICategory>> {
    const category = await categoryManager.findById(id);
    if (!category) {
        throw new Error(`La categoría con id "${id}" no existe`);
    }
    return category;
}
