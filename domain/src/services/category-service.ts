import { Category } from "../entities/category";
import { Service } from "../utils/types/service";

export interface CategoryService extends Service<Category>{
    findByName: (name: string) => Promise<Category | undefined>;
}