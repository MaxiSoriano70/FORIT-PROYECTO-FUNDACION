import { Category } from "../../entities/category";
import { CategoryService } from "../category-service";

export class MockedCategoryService implements CategoryService {
    private categories: Category[] = [];

    constructor(categories: Category[] = []) {
        this.categories = categories;
    }

    findAll = async (): Promise<Category[]> => {
        return this.categories;
    };

    findById = async (id: string): Promise<Category | undefined> => {
        return this.categories.find(c => c.id === id);
    };

    findByName = async (name: string): Promise<Category | undefined> => {
        return this.categories.find(
            c => c.name.toLowerCase() === name.toLowerCase()
        );
    };

    editOne = async (id: string, data: Partial<Category>): Promise<Category> => {
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error(`Categoria con ${id} no encontrada`);
        }
        this.categories[index] = { ...this.categories[index], ...data } as Category;
        return this.categories[index];
    };

    save = async (category: Category): Promise<void> => {
        const exists = this.categories.some(c => c.id === category.id);
        if (exists) {
            throw new Error(`Categoria con id ${category.id} ya existe`);
        }
        this.categories.push(category);
    };

    deleteById = async (id: string): Promise<void> => {
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error(`Categoria con ${id} no encontrada`);
        }
        this.categories.splice(index, 1);
    };
}
