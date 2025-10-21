import { Router } from "express";
import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { UserRole } from "../../../emuns/userRole.emun.js";

const routerUser = Router();

const getAllUsers = async (req, res) => {
    try {
        const users = await userManager.findAll();
        res.status(200).json({
            message: "Listado de usuarios",
            data: users,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userManager.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getUserByFirstName = async (req, res) => {
    try {
        const user = await userManager.findByFirstName(req.params.firstName);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getUserByLastName = async (req, res) => {
    try {
        const user = await userManager.findByLastName(req.params.lastName);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const user = await userManager.findByEmail(req.params.email);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getUserByFullName = async (req, res) => {
    try {
        const { firstName, lastName } = req.params;
        const user = await userManager.findByFullName(firstName, lastName);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({
            message: "Usuario encontrado",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const createUser = async (req, res) => {
    try {
        const user = await userManager.save(req.body);
        res.status(201).json({
            message: "Usuario creado correctamente",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("ya existe") ? 400 : 500;
        res.status(status).json({ message: msg });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userManager.editOne(req.params.id, req.body);
        res.status(200).json({
            message: "Usuario actualizado correctamente",
            data: user,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

const deleteUser = async (req, res) => {
    try {
        await userManager.deleteById(req.params.id);
        res.status(200).json({
            message: "Usuario eliminado correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

const changeUserRole = async (req, res) => {
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
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrado") ? 404 :
                        msg.includes("Rol inválido") ? 400 : 500;
        res.status(status).json({ message: msg });
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
