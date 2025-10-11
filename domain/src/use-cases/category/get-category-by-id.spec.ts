import { describe, expect, test, vi } from "vitest";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { categoryMock } from "../../entities/mock/category-mock";
import { getCategoryById } from "../../use-cases/category/get-category-by-id";

describe("Traer categoría por ID", () => {
    const categories = [
        categoryMock({ id: "1", name: "Recursos Humanos" }),
        categoryMock({ id: "2", name: "Informática" }),
    ];

    test("Debería devolver la categoría correcta según el ID", async () => {
        const categoryService = new MockedCategoryService(categories);
        const spyFindById = vi.spyOn(categoryService, "findById");

        const result = await getCategoryById("1", { categoryService });

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(spyFindById).toHaveBeenCalledWith("1");
        expect(result).toEqual(categories[0]);
    });

    test("Debería devolver undefined si no existe la categoría", async () => {
        const categoryService = new MockedCategoryService(categories);

        const result = await getCategoryById("999", { categoryService });

        expect(result).toBeUndefined();
    });
});
