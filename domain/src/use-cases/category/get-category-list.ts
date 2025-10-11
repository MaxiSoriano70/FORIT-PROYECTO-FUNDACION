import { CategoryService } from "../../services/category-service";

export interface GetCategoryListDesp{
    categoryService: CategoryService
}

export async function getCategoryList(deps: GetCategoryListDesp){
    return await deps.categoryService.findAll();
}