import { CategoryService } from "../../services/category-service";
import { Category } from "../../entities/category";

export interface SaveCategoryDeps {
    categoryService: CategoryService;
}

export async function saveCategory(category: Category, deps: SaveCategoryDeps) {
    return await deps.categoryService.save(category);
}
