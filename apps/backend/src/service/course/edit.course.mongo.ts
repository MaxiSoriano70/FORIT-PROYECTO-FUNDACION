import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { categoryManager } from "../../data/mongo/managers/category/category.manager.js";
import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { ICourse } from "../../data/mongo/models/course.model.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { UpdateQuery } from "mongoose";

export async function editCourse(id: string, data: UpdateQuery<ICourse>) {
    if (data.categoryId) {
        const category = await categoryManager.findById(data.categoryId);
        if (!category) {
            throw new Error(`La categoría con id "${data.categoryId}" no existe`);
        }
    }

    if (data.adminId) {
        const admin = await userManager.findById(data.adminId);
        if (!admin) {
            throw new Error(`El administrador con id "${data.adminId}" no existe`);
        }
        if (admin.role !== UserRole.ADMIN) {
            throw new Error(`El usuario con id "${data.adminId}" no tiene rol de ADMIN`);
        }
    }

    if (data.teacherId) {
        const teacher = await userManager.findById(data.teacherId);
        if (!teacher) {
            throw new Error(`El profesor con id "${data.teacherId}" no existe`);
        }
        if (teacher.role !== UserRole.TEACHER) {
            throw new Error(`El usuario con id "${data.teacherId}" no tiene rol de TEACHER`);
        }
    }

    const updatedCourse = await courseManager.editOne(id, data);
    return updatedCourse;
}
