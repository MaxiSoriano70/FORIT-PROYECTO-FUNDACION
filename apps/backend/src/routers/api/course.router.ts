import { Router } from "express";
import {
    getAllCourses,
    getCourseById,
    getCourseByName,
    getCoursesByCategoryId,
    getCoursesByTeacherId,
    getActiveCourses,
    getUpcomingCourses,
    getFullCourses,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../../controllers/course/course.controller.js";

const routerCourse = Router();

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
