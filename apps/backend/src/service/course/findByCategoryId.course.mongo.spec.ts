import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Category from "../../data/mongo/models/category.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { saveCourse } from "./save.course.mongo.js";
import { findByCategoryId } from "./findByCategoryId.course.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar cursos por categoría con Mongo", () => {
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

    it("Debería devolver un array vacío si no hay coincidencias", async () => {
        const courses = await findByCategoryId(new mongoose.Types.ObjectId().toString());
        expect(courses).toHaveLength(0);
    });

    it("Debería encontrar cursos por categoryId", async () => {
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

        const courseData = {
            name: "Curso de React Avanzado",
            description: "Aprende patrones avanzados en React",
            durationMonths: 4,
            schedule: "Lunes y Miércoles 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-07-31"),
            pricePerMonth: 180,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 30,
            enrolledCount: 10
        };

        await saveCourse(courseData as any);

        const foundCourses = (await findByCategoryId(category._id.toString())) ?? [];

        expect(foundCourses).toHaveLength(1);
        expect(foundCourses[0]?.name).toBe("Curso de React Avanzado");
        expect(foundCourses[0]?.teacherId?.toString()).toBe(teacher._id.toString());

    });
});
