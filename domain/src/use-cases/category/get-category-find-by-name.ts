import { CategoryService } from "../../services/category-service";

export interface GetCategoryByNameDeps {
    categoryService: CategoryService;
}

export async function getCategoryByName(name: string, deps: GetCategoryByNameDeps) {
    return await deps.categoryService.findByName(name);
}