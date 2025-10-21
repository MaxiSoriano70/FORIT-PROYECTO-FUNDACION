import { Router } from "express";
import { userManager } from "../../data/mongo/managers/user/user.manager.js";

const routerUser = Router();

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userManager.findAll();
        res.status(200).json({
            message: "Listado de usuarios",
            data: users,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userManager.findById(req.params.id);
        if (!user) {
            const err = new Error("Usuario no encontrado");
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next(error);
    }
};

const getUserByFirstName = async (req, res, next) => {
    try {
        const user = await userManager.findByFirstName(req.params.firstName);
        if (!user) {
            const err = new Error("Usuario no encontrado");
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next(error);
    }
};

const getUserByLastName = async (req, res, next) => {
    try {
        const user = await userManager.findByLastName(req.params.lastName);
        if (!user) {
            const err = new Error("Usuario no encontrado");
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next(error);
    }
};

const getUserByEmail = async (req, res, next) => {
    try {
        const user = await userManager.findByEmail(req.params.email);
        if (!user) {
            const err = new Error("Usuario no encontrado");
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next(error);
    }
};

const getUserByFullName = async (req, res, next) => {
    try {
        const { firstName, lastName } = req.params;
        const user = await userManager.findByFullName(firstName, lastName);
        if (!user) {
            const err = new Error("Usuario no encontrado");
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const user = await userManager.save(req.body);
        res.status(201).json({
            message: "Usuario creado correctamente",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        error.status = error.message.includes("ya existe") ? 400 : 500;
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userManager.editOne(req.params.id, req.body);
        res.status(200).json({
            message: "Usuario actualizado correctamente",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        error.status = error.message.includes("no encontrado") ? 404 : 500;
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userManager.deleteById(req.params.id);
        res.status(200).json({
            message: "Usuario eliminado correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        error.status = error.message.includes("no encontrado") ? 404 : 500;
        next(error);
    }
};

const changeUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newRole } = req.body;
        const user = await userManager.changeRole(id, newRole);
        res.status(200).json({
            message: `Rol cambiado correctamente a ${user.role}`,
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        if (error.message.includes("no encontrado")) error.status = 404;
        else if (error.message.includes("Rol inválido")) error.status = 400;
        else error.status = 500;
        next(error);
    }
};

routerUser.get("/", getAllUsers);
routerUser.get("/:id", getUserById);
routerUser.get("/firstName/:firstName", getUserByFirstName);
routerUser.get("/lastName/:lastName", getUserByLastName);
routerUser.get("/email/:email", getUserByEmail);
routerUser.get("/fullName/:firstName/:lastName", getUserByFullName);

routerUser.post("/", createUser);
routerUser.put("/:id", updateUser);
routerUser.delete("/:id", deleteUser);
routerUser.patch("/:id/role", changeUserRole);

export default routerUser;
