import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { ICategory } from "../../data/mongo/models/category.model.js";
import { Lean } from "../../data/mongo/managers/manager.mongo.js";

export async function findAllCategories(): Promise<Lean<ICategory>[]> {
    const categories = await categoryManager.findAll();
    if (!categories || categories.length === 0) {
        throw new Error("No hay categorías registradas");
    }
    return categories;
}
