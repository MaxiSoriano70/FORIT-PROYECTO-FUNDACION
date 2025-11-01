import { Document, Types } from "mongoose";
import Manager from "../manager.mongo.js";
import Category, { ICategory } from "../../models/category.model.js";

type Lean<T> = Omit<T, keyof Document> & { _id: Types.ObjectId };

class CategoryManager extends Manager<ICategory> {
    constructor() {
        super(Category);
    }

    findByName = async (name: string): Promise<Lean<ICategory> | null> => {
        return (await this.model.findOne({ name }).lean()) as Lean<ICategory> | null;
    };
}

const categoryManager = new CategoryManager();

export { categoryManager };
export default CategoryManager;
