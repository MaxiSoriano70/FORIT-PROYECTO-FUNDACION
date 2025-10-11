import { describe, expect, test, vi } from "vitest";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { categoryMock } from "../../entities/mock/category-mock";
import { updateCategory } from "./edit-category";


describe("Editar categoría", () => {
    const categories = [
        categoryMock({ id: "1", name: "Recursos Humanos", description: "RRHH" }),
        categoryMock({ id: "2", name: "Informática", description: "TI" }),
    ];

    test("Debería actualizar correctamente una categoría existente", async () => {
        const categoryService = new MockedCategoryService(categories);
        const spyEditOne = vi.spyOn(categoryService, "editOne");

        const updatedData = { name: "RRHH Actualizado" };

        const result = await updateCategory("1", updatedData, { categoryService });

        expect(spyEditOne).toHaveBeenCalledTimes(1);
        expect(spyEditOne).toHaveBeenCalledWith("1", updatedData);
        expect(result.name).toBe("RRHH Actualizado");
        expect(result.description).toBe("RRHH");
    });

    test("Debería lanzar un error si la categoría no existe", async () => {
        const categoryService = new MockedCategoryService(categories);
        const updatedData = { name: "Inexistente" };

        await expect(
            updateCategory("999", updatedData, { categoryService })
        ).rejects.toThrowError("Categoria con 999 no encontrada");
    });
});
