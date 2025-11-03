import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { ICourse } from "../../data/mongo/models/course.model.js";
import { UserRole } from "../../utils/enums/userRole.js";

export async function saveCourse(course: ICourse) {
    const category = await categoryManager.findById(course.categoryId);
    if (!category) {
        throw new Error(`La categoría con id "${course.categoryId}" no existe`);
    }

    const admin = await userManager.findById(course.adminId);
    if (!admin) {
        throw new Error(`El administrador con id "${course.adminId}" no existe`);
    }

    if (admin.role !== UserRole.ADMIN) {
        throw new Error(`El usuario con id "${course.adminId}" no tiene rol de ADMIN`);
    }

    if (course.teacherId) {
        const teacher = await userManager.findById(course.teacherId);
        if (!teacher) {
            throw new Error(`El profesor con id "${course.teacherId}" no existe`);
        }

        if (teacher.role !== UserRole.TEACHER) {
            throw new Error(`El usuario con id "${course.teacherId}" no tiene rol de TEACHER`);
        }
    }

    const savedCourse = await courseManager.save(course);
    return savedCourse;
}
