import { describe, expect, test, vi } from "vitest";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { categoryMock } from "../../entities/mock/category-mock";
import { deleteCategory } from "./delete-category";

describe("Eliminar categoría", () => {
    const categories = [
        categoryMock({ id: "1", name: "Recursos Humanos" }),
        categoryMock({ id: "2", name: "Informática" }),
    ];

    test("Debería eliminar una categoría existente", async () => {
        const categoryService = new MockedCategoryService(categories);
        const spyDelete = vi.spyOn(categoryService, "deleteById");

        await deleteCategory("1", { categoryService });

        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(spyDelete).toHaveBeenCalledWith("1");
        expect(categoryService.findAll()).resolves.toHaveLength(1);
    });

    test("Debería lanzar error si la categoría no existe", async () => {
        const categoryService = new MockedCategoryService(categories);

        await expect(deleteCategory("999", { categoryService }))
            .rejects
            .toThrowError("Categoria con 999 no encontrada");
    });
});
