import { CategoryService } from "../../services/category-service";

export interface DeleteCategoryDeps {
    categoryService: CategoryService;
}

export async function deleteCategory(id: string, deps: DeleteCategoryDeps) {
    return await deps.categoryService.deleteById(id);
}
