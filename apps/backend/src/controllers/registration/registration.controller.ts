import { Request, Response, NextFunction } from "express";
import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";
import { CustomError } from "../../middlewares/errorHandler.mid.js";

export const registrationController = {
    getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registrations = await registrationManager.findAll();
            res.status(200).json({
                message: "Listado de inscripciones",
                data: registrations,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            next({ message: err.message || String(error), status: 500 });
        }
    },

    getById: async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registration = await registrationManager.findById(req.params.id);
            if (!registration) return next({ message: "Inscripción no encontrada", status: 404 });
            res.status(200).json({
                message: "Inscripción encontrada",
                data: registration,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            next({ message: err.message || String(error), status: 500 });
        }
    },

    getByStudent: async (req: Request<{ studentId: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registrations = await registrationManager.findByStudentId(req.params.studentId);
            res.status(200).json({
                message: "Inscripciones del alumno",
                data: registrations,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            next({ message: err.message || String(error), status: 500 });
        }
    },

    getByCourse: async (req: Request<{ courseId: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registrations = await registrationManager.findByCourseId(req.params.courseId);
            res.status(200).json({
                message: "Inscripciones del curso",
                data: registrations,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            next({ message: err.message || String(error), status: 500 });
        }
    },

    create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registration = await registrationManager.createRegistration({
                studentId: req.body.studentId,
                courseId: req.body.courseId,
            });

            res.status(201).json({
                message: "Inscripción creada correctamente",
                data: registration,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            const status = err.message.includes("ya está inscripto") ? 400 :
                err.message.includes("no existe") ? 404 :
                    err.message.includes("completo") ? 400 : 500;

            next({ message: err.message || String(error), status });
        }
    },

    update: async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registration = await registrationManager.editOne(req.params.id, req.body);
            res.status(200).json({
                message: "Inscripción actualizada correctamente",
                data: registration,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            const status = err.message.includes("no encontrada") ? 404 : 500;
            next({ message: err.message || String(error), status });
        }
    },

    delete: async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            await registrationManager.deleteById(req.params.id);
            res.status(200).json({
                message: "Inscripción eliminada correctamente",
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            const status = err.message.includes("no encontrada") ? 404 : 500;
            next({ message: err.message || String(error), status });
        }
    },

    markQuotaPaid: async (req: Request<{ id: string }, {}, { quantity?: number }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const registration = await registrationManager.markQuotaPaid(id, quantity);
            res.status(200).json({
                message: `Se marcaron ${quantity || 1} cuota(s) como pagadas`,
                data: registration,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            const status = err.message.includes("no encontrada") ? 404 : 500;
            next({ message: err.message || String(error), status });
        }
    },

    finishCourse: async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const registration = await registrationManager.finishCourse(id);
            res.status(200).json({
                message: "Curso finalizado correctamente",
                data: registration,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            const status = err.message.includes("no encontrada") ? 404 : 500;
            next({ message: err.message || String(error), status });
        }
    },

    getActive: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registrations = await registrationManager.findActive();
            res.status(200).json({
                message: "Inscripciones activas",
                data: registrations,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            next({ message: err.message || String(error), status: 500 });
        }
    },

    getIncomplete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registrations = await registrationManager.findIncomplete();
            res.status(200).json({
                message: "Inscripciones incompletas",
                data: registrations,
                method: req.method,
                url: req.url,
            });
        } catch (error: unknown) {
            const err = error as CustomError;
            next({ message: err.message || String(error), status: 500 });
        }
    },
};
