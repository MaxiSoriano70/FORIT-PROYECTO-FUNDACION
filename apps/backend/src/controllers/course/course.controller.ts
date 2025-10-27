import { Request, Response, NextFunction } from "express";
import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { CustomError } from "../../middlewares/errorHandler.mid.js";

export const getAllCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await courseManager.findAll();
        res.status(200).json({
            message: "Listado de cursos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getCourseById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await courseManager.findById(req.params.id);
        if (!course) return next({ message: "Curso no encontrado", status: 404 });
        res.status(200).json({
            message: "Curso encontrado",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getCourseByName = async (req: Request<{ name: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await courseManager.findByName(req.params.name);
        if (!course) return next({ message: "Curso no encontrado", status: 404 });
        res.status(200).json({
            message: "Curso encontrado",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getCoursesByCategoryId = async (req: Request<{ categoryId: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await courseManager.findByCategoryId(req.params.categoryId);
        res.status(200).json({
            message: "Cursos por categoría",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getCoursesByTeacherId = async (req: Request<{ teacherId: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await courseManager.findByTeacherId(req.params.teacherId);
        res.status(200).json({
            message: "Cursos del docente",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getActiveCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await courseManager.findActiveCourses();
        res.status(200).json({
            message: "Cursos activos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getUpcomingCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await courseManager.findUpcomingCourses();
        res.status(200).json({
            message: "Próximos cursos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getFullCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await courseManager.findFullCourses();
        res.status(200).json({
            message: "Cursos completos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await courseManager.save(req.body);
        res.status(201).json({
            message: "Curso creado correctamente",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const msg = err.message || String(error);
        const status = msg.includes("ya existe") ? 400 : 500;
        next({ message: msg, status });
    }
};

export const updateCourse = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await courseManager.editOne(req.params.id, req.body);
        res.status(200).json({
            message: "Curso actualizado correctamente",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const msg = err.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        next({ message: msg, status });
    }
};

export const deleteCourse = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await courseManager.deleteById(req.params.id);
        res.status(200).json({
            message: "Curso eliminado correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const msg = err.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        next({ message: msg, status });
    }
};
