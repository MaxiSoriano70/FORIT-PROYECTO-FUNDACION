import { Router } from "express";
import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";

const routerCategory = Router();

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryManager.findAll();
        res.status(200).json({
            message: "Listado de categorías",
            data: categories,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryManager.findById(req.params.id);
        if (!category) {
            return next({ message: "Categoría no encontrada", status: 404 });
        }
        res.status(200).json({
            message: "Categoría encontrada",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getCategoryByName = async (req, res, next) => {
    try {
        const category = await categoryManager.findByName(req.params.name);
        if (!category) {
            return next({ message: "Categoría no encontrada", status: 404 });
        }
        res.status(200).json({
            message: "Categoría encontrada",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const createCategory = async (req, res, next) => {
    try {
        const category = await categoryManager.save(req.body);
        res.status(201).json({
            message: "Categoría creada correctamente",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("ya existe") ? 400 : 500;
        next({ message: msg, status });
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryManager.editOne(req.params.id, req.body);
        res.status(200).json({
            message: "Categoría actualizada correctamente",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrada") ? 404 : 500;
        next({ message: msg, status });
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        await categoryManager.deleteById(req.params.id);
        res.status(200).json({
            message: "Categoría eliminada correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrada") ? 404 : 500;
        next({ message: msg, status });
    }
};

routerCategory.get("/", getAllCategories);
routerCategory.get("/:id", getCategoryById);
routerCategory.get("/name/:name", getCategoryByName);
routerCategory.post("/", createCategory);
routerCategory.put("/:id", updateCategory);
routerCategory.delete("/:id", deleteCategory);

export default routerCategory;
