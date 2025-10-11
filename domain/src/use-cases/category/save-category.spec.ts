import { describe, expect, test, vi } from "vitest";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { categoryMock } from "../../entities/mock/category-mock";
import { saveCategory } from "../../use-cases/category/save-category";

describe("Guardar categoría", () => {
    const categories = [
        categoryMock({ id: "1", name: "Recursos Humanos" })
    ];

    test("Debería guardar una nueva categoría", async () => {
        const categoryService = new MockedCategoryService(categories);
        const spySave = vi.spyOn(categoryService, "save");

        const newCategory = categoryMock({ id: "2", name: "Informática" });

        await saveCategory(newCategory, { categoryService });

        expect(spySave).toHaveBeenCalledTimes(1);
        expect(spySave).toHaveBeenCalledWith(newCategory);

        const allCategories = await categoryService.findAll();
        expect(allCategories).toHaveLength(2);
    });

    test("Debería lanzar error si la categoría ya existe", async () => {
        const categoryService = new MockedCategoryService(categories);
        const existingCategory = categories[0];
        if (!existingCategory) throw new Error("No hay categorías para testear");

        await expect(saveCategory(existingCategory, { categoryService }))
            .rejects
            .toThrowError(`Categoria con id ${existingCategory.id} ya existe`);
    });
});
