import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Category from "../../data/mongo/models/category.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { saveCourse } from "./save.course.mongo.js";
import { findAllCourses } from "./findAll.course.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Obtener todos los cursos con Mongo", () => {
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
        await Promise.all([
            User.deleteMany(),
            Category.deleteMany(),
            Course.deleteMany()
        ]);
    });

    it("Debería devolver un arreglo vacío si no hay cursos", async () => {
        const courses = await findAllCourses();
        expect(courses).toBeInstanceOf(Array);
        expect(courses).toHaveLength(0);
    });

    it("Debería devolver todos los cursos guardados", async () => {
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
            name: "Programación",
            description: "Cursos sobre desarrollo de software"
        });

        const coursesData = [
            {
                name: "Curso de Node.js",
                description: "Aprende backend con Node.js",
                durationMonths: 6,
                schedule: "Lunes y Miércoles 18-20hs",
                startDate: new Date("2025-01-01"),
                endDate: new Date("2025-06-30"),
                pricePerMonth: 150,
                categoryId: category._id,
                adminId: admin._id,
                teacherId: teacher._id,
                maxCapacity: 50,
                enrolledCount: 0
            },
            {
                name: "Curso de React",
                description: "Aprende frontend con React",
                durationMonths: 4,
                schedule: "Martes y Jueves 18-20hs",
                startDate: new Date("2025-02-01"),
                endDate: new Date("2025-05-31"),
                pricePerMonth: 120,
                categoryId: category._id,
                adminId: admin._id,
                teacherId: teacher._id,
                maxCapacity: 40,
                enrolledCount: 0
            }
        ];

        for (const course of coursesData) {
            await saveCourse(course as any);
        }

        const allCourses = await findAllCourses();

        expect(allCourses).toHaveLength(2);
        const names = allCourses.map(c => c.name);
        expect(names).toContain("Curso de Node.js");
        expect(names).toContain("Curso de React");
    });
});
