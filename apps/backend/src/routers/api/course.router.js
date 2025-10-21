import { Router } from "express";
import { courseManager } from "../../../data/mongo/managers/course/course.manager.js";

const routerCourse = Router();

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseManager.findAll();
        res.status(200).json({
            message: "Listado de cursos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await courseManager.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Curso no encontrado" });
        res.status(200).json({
            message: "Curso encontrado",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getCourseByName = async (req, res) => {
    try {
        const course = await courseManager.findByName(req.params.name);
        if (!course) return res.status(404).json({ message: "Curso no encontrado" });
        res.status(200).json({
            message: "Curso encontrado",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getCoursesByCategoryId = async (req, res) => {
    try {
        const courses = await courseManager.findByCategoryId(req.params.categoryId);
        res.status(200).json({
            message: "Cursos por categoría",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getCoursesByTeacherId = async (req, res) => {
    try {
        const courses = await courseManager.findByTeacherId(req.params.teacherId);
        res.status(200).json({
            message: "Cursos del docente",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getActiveCourses = async (req, res) => {
    try {
        const courses = await courseManager.findActiveCourses();
        res.status(200).json({
            message: "Cursos activos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getUpcomingCourses = async (req, res) => {
    try {
        const courses = await courseManager.findUpcomingCourses();
        res.status(200).json({
            message: "Próximos cursos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const getFullCourses = async (req, res) => {
    try {
        const courses = await courseManager.findFullCourses();
        res.status(200).json({
            message: "Cursos completos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message || String(error) });
    }
};

const createCourse = async (req, res) => {
    try {
        const course = await courseManager.save(req.body);
        res.status(201).json({
            message: "Curso creado correctamente",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("ya existe") ? 400 : 500;
        res.status(status).json({ message: msg });
    }
};

const updateCourse = async (req, res) => {
    try {
        const course = await courseManager.editOne(req.params.id, req.body);
        res.status(200).json({
            message: "Curso actualizado correctamente",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

const deleteCourse = async (req, res) => {
    try {
        await courseManager.deleteById(req.params.id);
        res.status(200).json({
            message: "Curso eliminado correctamente",
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        const msg = error?.message || String(error);
        const status = msg.includes("no encontrado") ? 404 : 500;
        res.status(status).json({ message: msg });
    }
};

routerCourse.get("/", getAllCourses);
routerCourse.get("/:id", getCourseById);
routerCourse.get("/name/:name", getCourseByName);
routerCourse.get("/category/:categoryId", getCoursesByCategoryId);
routerCourse.get("/teacher/:teacherId", getCoursesByTeacherId);
routerCourse.get("/active", getActiveCourses);
routerCourse.get("/upcoming", getUpcomingCourses);
routerCourse.get("/full", getFullCourses);

routerCourse.post("/", createCourse);
routerCourse.put("/:id", updateCourse);
routerCourse.delete("/:id", deleteCourse);

export default routerCourse;
