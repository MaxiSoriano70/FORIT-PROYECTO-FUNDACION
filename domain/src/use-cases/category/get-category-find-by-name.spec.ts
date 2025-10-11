import { describe, expect, test, vi } from "vitest";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { categoryMock } from "../../entities/mock/category-mock";
import { getCategoryByName } from "./get-category-find-by-name";


describe("Traer categoría por nombre", () => {
    const categories = [
        categoryMock({ id: "1", name: "Recursos Humanos" }),
        categoryMock({ id: "2", name: "Informática" })
    ];

    test("Debería devolver la categoría correcta según el nombre", async () => {
        const categoryService = new MockedCategoryService(categories);
        const spyFindByName = vi.spyOn(categoryService, "findByName");

        const result = await getCategoryByName("Recursos Humanos", { categoryService });

        expect(spyFindByName).toHaveBeenCalledTimes(1);
        expect(spyFindByName).toHaveBeenCalledWith("Recursos Humanos");
        expect(result).toEqual(categories[0]);
    });

    test("Debería devolver undefined si no existe la categoría", async () => {
        const categoryService = new MockedCategoryService(categories);
        const result = await getCategoryByName("No existe", { categoryService });
        expect(result).toBeUndefined();
    });
});
