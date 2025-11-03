import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Category from "../../data/mongo/models/category.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { saveCourse } from "./save.course.mongo.js";
import { findCourseById } from "./findById.course.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar curso por ID con Mongo", () => {
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

    it("Debería devolver null si el curso no existe", async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        const course = await findCourseById(nonExistingId.toString());
        expect(course).toBeNull();
    });

    it("Debería devolver el curso correcto por ID", async () => {
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
            name: "Backend",
            description: "Cursos sobre desarrollo backend"
        });

        const courseData = {
            name: "Curso de Express.js",
            description: "Aprende a crear APIs con Express",
            durationMonths: 3,
            schedule: "Martes y Jueves 19-21hs",
            startDate: new Date("2025-03-01"),
            endDate: new Date("2025-05-31"),
            pricePerMonth: 100,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 40,
            enrolledCount: 0
        };

        const savedCourse = await saveCourse(courseData as any);

        const foundCourse = await findCourseById(savedCourse._id.toString());

        expect(foundCourse).not.toBeNull();
        expect(foundCourse?.name).toBe("Curso de Express.js");
        expect(foundCourse?.description).toBe("Aprende a crear APIs con Express");
    });
});
