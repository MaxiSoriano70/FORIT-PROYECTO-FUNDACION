import { Router } from "express";
import {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../controllers/category/category.controller.js";

const routerCategory = Router();

routerCategory.get("/", getAllCategories);
routerCategory.get("/:id", getCategoryById);
routerCategory.get("/name/:name", getCategoryByName);
routerCategory.post("/", createCategory);
routerCategory.put("/:id", updateCategory);
routerCategory.delete("/:id", deleteCategory);

export default routerCategory;
