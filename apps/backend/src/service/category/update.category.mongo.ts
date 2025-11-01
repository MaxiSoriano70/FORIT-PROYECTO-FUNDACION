import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { ICategory } from "../../data/mongo/models/category.model.js";

export async function updateCategory(id: string, data: Partial<ICategory>) {
    const existing = await categoryManager.findById(id);
    if (!existing) {
        throw new Error(`La categoría con id "${id}" no existe`);
    }

    if (data.name && data.name !== existing.name) {
        const duplicate = await categoryManager.findByName(data.name);
        if (duplicate) {
            throw new Error(`Ya existe una categoría con el nombre "${data.name}"`);
        }
    }

    const updated = await categoryManager.editOne(id, data);
    if (!updated) {
        throw new Error("No se pudo actualizar la categoría");
    }

    return updated;
}
