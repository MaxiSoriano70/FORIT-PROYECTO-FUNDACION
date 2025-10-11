import { CategoryService } from "../../services/category-service";

export interface GetCategoryByIdDeps {
    categoryService: CategoryService;
}

export async function getCategoryById(id: string, deps: GetCategoryByIdDeps) {
    return await deps.categoryService.findById(id);
}