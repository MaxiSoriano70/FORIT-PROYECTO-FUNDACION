import { describe, expect, test, vi } from "vitest";
import { MockedCategoryService } from "../../services/mocks/mock-category-service";
import { categoryMock } from "../../entities/mock/category-mock";
import { getCategoryList } from "../../use-cases/category/get-category-list";

describe("Traer todas las categorias", () => {
    const categories = [
        categoryMock({ id: "1", name: "Recursos Humanos" }),
        categoryMock({ id: "2", name: "Informática" }),
    ];

    test("Debería devolver todas las categorías", async () => {

        const categoryService = new MockedCategoryService(categories);
        const spyFindAll = vi.spyOn(categoryService, "findAll");

        const result = await getCategoryList({ categoryService });

        expect(spyFindAll).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(categories.length);
        expect(result).toEqual(categories);
    });
});

