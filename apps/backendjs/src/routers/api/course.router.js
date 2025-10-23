import { Router } from "express";
import { courseManager } from "../../data/mongo/managers/course/course.manager.js";

const routerCourse = Router();

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseManager.findAll();
        res.status(200).json({
            message: "Listado de cursos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getCourseById = async (req, res, next) => {
    try {
        const course = await courseManager.findById(req.params.id);
        if (!course) return next({ message: "Curso no encontrado", status: 404 });
        res.status(200).json({
            message: "Curso encontrado",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getCourseByName = async (req, res, next) => {
    try {
        const course = await courseManager.findByName(req.params.name);
        if (!course) return next({ message: "Curso no encontrado", status: 404 });
        res.status(200).json({
            message: "Curso encontrado",
            data: course,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getCoursesByCategoryId = async (req, res, next) => {
    try {
        const courses = await courseManager.findByCategoryId(req.params.categoryId);
        res.status(200).json({
            message: "Cursos por categoría",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getCoursesByTeacherId = async (req, res, next) => {
    try {
        const courses = await courseManager.findByTeacherId(req.params.teacherId);
        res.status(200).json({
            message: "Cursos del docente",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getActiveCourses = async (req, res, next) => {
    try {
        const courses = await courseManager.findActiveCourses();
        res.status(200).json({
            message: "Cursos activos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getUpcomingCourses = async (req, res, next) => {
    try {
        const courses = await courseManager.findUpcomingCourses();
        res.status(200).json({
            message: "Próximos cursos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const getFullCourses = async (req, res, next) => {
    try {
        const courses = await courseManager.findFullCourses();
        res.status(200).json({
            message: "Cursos completos",
            data: courses,
            method: req.method,
            url: req.url,
        });
    } catch (error) {
        next({ message: error?.message || String(error), status: 500 });
    }
};

const createCourse = async (req, res, next) => {
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
        next({ message: msg, status });
    }
};

const updateCourse = async (req, res, next) => {
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
        next({ message: msg, status });
    }
};

const deleteCourse = async (req, res, next) => {
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
        next({ message: msg, status });
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