import Manager from "../manager.mongo.js";
import Category from "../../models/category.model.js";

class CategoryManager extends Manager {
    constructor() {
        super(Category);
    }

    findByName = async (name) => {
        return await this.model.findOne({ name }).lean();
    };
}

const categoryManager = new CategoryManager();

export { categoryManager };
export default CategoryManager;
