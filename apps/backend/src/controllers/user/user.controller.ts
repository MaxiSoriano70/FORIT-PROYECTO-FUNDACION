import { Request, Response, NextFunction } from "express";
import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { CustomError } from "../../middlewares/errorHandler.mid.js";
import { UserRole } from "../../utils/enums/userRole.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userManager.findAll();
        res.status(200).json({
            message: "Listado de usuarios",
            data: users,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userManager.findById(req.params.id);
        if (!user) return next({ message: "Usuario no encontrado", status: 404 });
        res.status(200).json({ message: "Usuario encontrado", data: user, method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getUserByFirstName = async (req: Request<{ firstName: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userManager.findByFirstName(req.params.firstName);
        if (!user) return next({ message: "Usuario no encontrado", status: 404 });
        res.status(200).json({ message: "Usuario encontrado", data: user, method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getUserByLastName = async (req: Request<{ lastName: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userManager.findByLastName(req.params.lastName);
        if (!user) return next({ message: "Usuario no encontrado", status: 404 });
        res.status(200).json({ message: "Usuario encontrado", data: user, method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getUserByEmail = async (req: Request<{ email: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userManager.findByEmail(req.params.email);
        if (!user) return next({ message: "Usuario no encontrado", status: 404 });
        res.status(200).json({ message: "Usuario encontrado", data: user, method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const getUserByFullName = async (
    req: Request<{ firstName: string; lastName: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { firstName, lastName } = req.params;
        const user = await userManager.findByFullName(firstName, lastName);
        if (!user) return next({ message: "Usuario no encontrado", status: 404 });
        res.status(200).json({ message: "Usuario encontrado", data: user, method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userManager.save(req.body);
        res.status(201).json({ message: "Usuario creado correctamente", data: user, method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        const status = err.message.includes("ya existe") ? 400 : 500;
        next({ message: err.message || String(error), status });
    }
};

export const updateUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userManager.editOne(req.params.id, req.body);
        res.status(200).json({ message: "Usuario actualizado correctamente", data: user, method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        const status = err.message.includes("no encontrado") ? 404 : 500;
        next({ message: err.message || String(error), status });
    }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await userManager.deleteById(req.params.id);
        res.status(200).json({ message: "Usuario eliminado correctamente", method: req.method, url: req.url });
    } catch (error: unknown) {
        const err = error as CustomError;
        const status = err.message.includes("no encontrado") ? 404 : 500;
        next({ message: err.message || String(error), status });
    }
};

export const changeUserRole = async (
    req: Request<{ id: string }, {}, { newRole: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { newRole } = req.body;

        if (!Object.values(UserRole).includes(newRole as UserRole)) {
            const err: CustomError = new Error("Rol inválido");
            err.status = 400;
            return next(err);
        }

        const user = await userManager.changeRole(id, newRole as UserRole);

        if (!user) {
            const err: CustomError = new Error("Usuario no encontrado");
            err.status = 404;
            return next(err);
        }

        res.status(200).json({
            message: `Rol cambiado correctamente a ${user.role}`,
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        if (!err.status) err.status = 500;
        next(err);
    }
};

export const getUsersByRole = async (req: Request<{ role: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { role } = req.params;

        if (!Object.values(UserRole).includes(role as UserRole)) {
            return next({ message: "Rol inválido", status: 400 });
        }

        const users = await userManager.findByRole(role as UserRole);

        if (!users || users.length === 0) {
            return next({ message: "No se encontraron usuarios con ese rol", status: 404 });
        }

        res.status(200).json({
            message: `Usuarios con rol ${role}`,
            data: users,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        next({ message: err.message || String(error), status: 500 });
    }
};

