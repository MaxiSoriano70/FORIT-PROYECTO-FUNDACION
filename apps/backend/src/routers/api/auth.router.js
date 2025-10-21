import { Router } from "express";
import { authManager } from "../../data/mongo/managers/auth/auth.manager.js";

const routerAuth = Router();

const register = async (req, res) => {
    try {
        const data = req.body;
        const user = await authManager.register(data);
        return res.status(201).json({
            message: "Usuario registrado correctamente",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        let status = 500;

        if (msg === "El email ya está registrado") status = 400;

        return res.status(status).json({ message: msg });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authManager.login(email, password);
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        let status = 500;

        if (msg === "Usuario no encontrado") status = 404;
        else if (msg === "Contraseña incorrecta") status = 401;

        return res.status(status).json({ message: msg });
    }
};

routerAuth.post("/register", register);
routerAuth.post("/login", login);

export default routerAuth;
