import { Request, Response, NextFunction } from "express";
import { authManager } from "../../data/mongo/managers/auth/auth.manager.js";
import { CustomError } from "../../middlewares/errorHandler.mid.js";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await authManager.login(email, password);
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error: unknown) {
        const err = error as CustomError;
        const msg = err.message || "Error interno del servidor";
        let status = 500;

        if (msg === "Usuario no encontrado") status = 404;
        else if (msg === "Contraseña incorrecta") status = 401;

        next({ message: msg, status });
    }
};
