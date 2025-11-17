import { Request, Response, NextFunction } from "express";
import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { CustomError } from "../../middlewares/errorHandler.mid.js";

export const getAllInformation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const informations = await informationManager.findAll();
        res.status(200).json({
            message: "Listado de solicitudes de información",
            data: informations,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getInformationById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const info = await informationManager.findById(req.params.id);
        if (!info) return next({ message: "Solicitud no encontrada", status: 404 });

        res.status(200).json({
            message: "Solicitud encontrada",
            data: info,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const createInformation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const info = await informationManager.create(req.body);
        res.status(201).json({
            message: "Solicitud de información procesada correctamente",
            data: info,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 400 });
    }
};

export const updateInformation = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const info = await informationManager.editOne(req.params.id, req.body);
        if (!info) return next({ message: "Solicitud no encontrada", status: 404 });

        res.status(200).json({
            message: "Solicitud actualizada correctamente",
            data: info,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const deleteInformation = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deleted = await informationManager.deleteById(req.params.id);
        if (!deleted) return next({ message: "Solicitud no encontrada", status: 404 });

        res.status(200).json({
            message: "Solicitud eliminada correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const convertInformationToUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await informationManager.convertToUser(req.params.id);

        res.status(200).json({
            message: `Solicitud convertida en usuario correctamente`,
            data: result,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 400 });
    }
};
