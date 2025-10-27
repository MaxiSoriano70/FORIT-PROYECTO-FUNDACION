import { Router, Request, Response, NextFunction } from "express";
import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";
import { CustomError } from "../../middlewares/errorHandler.mid.js";

const routerRegistration = Router();

const getAllRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
};

const getRegistrationById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
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
};

const getRegistrationsByStudent = async (req: Request<{ studentId: string }>, res: Response, next: NextFunction): Promise<void> => {
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
};

const getRegistrationsByCourse = async (req: Request<{ courseId: string }>, res: Response, next: NextFunction): Promise<void> => {
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
};

const createRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const registration = await registrationManager.save(req.body);
        res.status(201).json({
            message: "Inscripción creada correctamente",
            data: registration,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const status = err.message.includes("ya existe") ? 400 : 500;
        next({ message: err.message || String(error), status });
    }
};

const updateRegistration = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
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
};

const deleteRegistration = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
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
};

const markQuotaPaid = async (req: Request<{ id: string }, {}, { quantity?: number }>, res: Response, next: NextFunction): Promise<void> => {
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
};

const finishCourse = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
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
};

const getActiveRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
};

const getIncompleteRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
};

routerRegistration.get("/", getAllRegistrations);
routerRegistration.get("/:id", getRegistrationById);
routerRegistration.get("/student/:studentId", getRegistrationsByStudent);
routerRegistration.get("/course/:courseId", getRegistrationsByCourse);

routerRegistration.post("/", createRegistration);
routerRegistration.put("/:id", updateRegistration);
routerRegistration.delete("/:id", deleteRegistration);

routerRegistration.patch("/:id/quota", markQuotaPaid);
routerRegistration.patch("/:id/finish", finishCourse);

routerRegistration.get("/active/list", getActiveRegistrations);
routerRegistration.get("/incomplete/list", getIncompleteRegistrations);

export default routerRegistration;
