import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { ICategory } from "../../data/mongo/models/category.model.js";

export async function saveCategory(category: ICategory) {
    const existing = await categoryManager.findByName(category.name);
    if (existing) {
        throw new Error(`La categoría "${category.name}" ya existe`);
    }

    const newCategory = await categoryManager.save(category);
    return newCategory;
}
