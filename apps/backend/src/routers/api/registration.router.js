import { Router } from "express";
import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";

const routerRegistration = Router();

const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await registrationManager.findAll();
        res.status(200).json({
            message: "Listado de inscripciones",
            data: registrations,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getRegistrationById = async (req, res) => {
    try {
        const registration = await registrationManager.findById(req.params.id);
        if (!registration) return res.status(404).json({ message: "Inscripción no encontrada" });
        res.status(200).json({
            message: "Inscripción encontrada",
            data: registration,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getRegistrationsByStudent = async (req, res) => {
    try {
        const registrations = await registrationManager.findByStudentId(req.params.studentId);
        res.status(200).json({
            message: "Inscripciones del alumno",
            data: registrations,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getRegistrationsByCourse = async (req, res) => {
    try {
        const registrations = await registrationManager.findByCourseId(req.params.courseId);
        res.status(200).json({
            message: "Inscripciones del curso",
            data: registrations,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const createRegistration = async (req, res) => {
    try {
        const registration = await registrationManager.save(req.body);
        res.status(201).json({
            message: "Inscripción creada correctamente",
            data: registration,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("ya existe") ? 400 : 500;
        res.status(status).json({ message: msg });
    }
};

const updateRegistration = async (req, res) => {
    try {
        const registration = await registrationManager.editOne(req.params.id, req.body);
        res.status(200).json({
            message: "Inscripción actualizada correctamente",
            data: registration,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

const deleteRegistration = async (req, res) => {
    try {
        await registrationManager.deleteById(req.params.id);
        res.status(200).json({
            message: "Inscripción eliminada correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

const markQuotaPaid = async (req, res) => {
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
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrada") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

const finishCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await registrationManager.finishCourse(id);
        res.status(200).json({
            message: "Curso finalizado correctamente",
            data: registration,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrada") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

const getActiveRegistrations = async (req, res) => {
    try {
        const registrations = await registrationManager.findActive();
        res.status(200).json({
            message: "Inscripciones activas",
            data: registrations,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getIncompleteRegistrations = async (req, res) => {
    try {
        const registrations = await registrationManager.findIncomplete();
        res.status(200).json({
            message: "Inscripciones incompletas",
            data: registrations,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
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
