import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { ICategory } from "../../data/mongo/models/category.model.js";
import { Lean } from "../../data/mongo/managers/manager.mongo.js";

export async function findCategoryBy(name: string): Promise<Lean<ICategory>> {
    const category = await categoryManager.findBy({ name });
    if (!category) {
        throw new Error(`La categoría con nombre "${name}" no existe`);
    }
    return category;
}
