import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Category from "../../data/mongo/models/category.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { saveCourse } from "./save.course.mongo.js";
import { findActiveCourses } from "./findActiveCourses.course.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar cursos activos con Mongo", () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Promise.all([User.deleteMany(), Category.deleteMany(), Course.deleteMany()]);
    });

    it("Debería devolver un array vacío si no hay cursos activos", async () => {
        const courses = await findActiveCourses();
        expect(courses).toHaveLength(0);
    });

    it("Debería devolver solo cursos cuya endDate sea mayor o igual a hoy", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Admin 101",
            role: UserRole.ADMIN
        });

        const teacher = await User.create({
            firstName: "Profesor",
            lastName: "García",
            email: "teacher@example.com",
            password: "Pass123!",
            phone: "+541199887766",
            address: "Calle Docente 456",
            role: UserRole.TEACHER
        });

        const category = await Category.create({
            name: "Frontend",
            description: "Cursos sobre desarrollo frontend"
        });

        const today = new Date();

        await saveCourse({
            name: "Curso Activo",
            description: "Curso que aún no terminó",
            durationMonths: 3,
            schedule: "Lunes 18-20hs",
            startDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
            endDate: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
            pricePerMonth: 150,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 30,
            enrolledCount: 5
        } as any);

        await saveCourse({
            name: "Curso Terminado",
            description: "Curso que ya finalizó",
            durationMonths: 3,
            schedule: "Martes 18-20hs",
            startDate: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
            endDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
            pricePerMonth: 120,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 25,
            enrolledCount: 10
        } as any);

        const activeCourses = await findActiveCourses();

        expect(activeCourses).toHaveLength(1);
        expect(activeCourses[0]?.name).toBe("Curso Activo");
    });
});
