import { CategoryService } from "../../services/category-service";

export interface UpdateCategoryDeps {
    categoryService: CategoryService;
}

export async function updateCategory(
    id: string,
    data: Partial<{ name: string; description: string }>,
    deps: UpdateCategoryDeps
) {
    return await deps.categoryService.editOne(id, data);
}
