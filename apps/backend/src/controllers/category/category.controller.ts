import { Request, Response, NextFunction } from "express";
import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { CustomError } from "../../middlewares/errorHandler.mid.js";

export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await categoryManager.findAll();
        res.status(200).json({
            message: "Listado de categorías",
            data: categories,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || "Error interno del servidor", status: 500 });
    }
};

export const getCategoryById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const category = await categoryManager.findById(req.params.id);
        if (!category) return next({ message: "Categoría no encontrada", status: 404 });
        res.status(200).json({
            message: "Categoría encontrada",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || "Error interno del servidor", status: 500 });
    }
};

export const getCategoryByName = async (req: Request<{ name: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const category = await categoryManager.findByName(req.params.name);
        if (!category) return next({ message: "Categoría no encontrada", status: 404 });
        res.status(200).json({
            message: "Categoría encontrada",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || "Error interno del servidor", status: 500 });
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const category = await categoryManager.save(req.body);
        res.status(201).json({
            message: "Categoría creada correctamente",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const msg = err.message || "Error interno del servidor";
        const status = msg.includes("ya existe") ? 400 : 500;
        next({ message: msg, status });
    }
};

export const updateCategory = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const category = await categoryManager.editOne(req.params.id, req.body);
        res.status(200).json({
            message: "Categoría actualizada correctamente",
            data: category,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const msg = err.message || "Error interno del servidor";
        const status = msg.includes("no encontrada") ? 404 : 500;
        next({ message: msg, status });
    }
};

export const deleteCategory = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await categoryManager.deleteById(req.params.id);
        res.status(200).json({
            message: "Categoría eliminada correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const msg = err.message || "Error interno del servidor";
        const status = msg.includes("no encontrada") ? 404 : 500;
        next({ message: msg, status });
    }
};
