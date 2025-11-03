import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Category from "../../data/mongo/models/category.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { saveCourse } from "./save.course.mongo.js";
import { deleteCourse } from "./delete.course.mongo.js";
import { findCourseById } from "./findById.course.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Eliminar curso con Mongo", () => {
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

    it("Debería devolver null si se intenta eliminar un curso inexistente", async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        const deleted = await deleteCourse(nonExistingId.toString());
        expect(deleted).toBeNull();
    });

    it("Debería eliminar correctamente un curso existente", async () => {
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
            name: "Curso de Node.js",
            description: "Aprende a crear APIs con Node.js",
            durationMonths: 6,
            schedule: "Lunes y Miércoles 19-21hs",
            startDate: new Date("2025-03-01"),
            endDate: new Date("2025-08-31"),
            pricePerMonth: 200,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 40,
            enrolledCount: 0
        };

        const saved = await saveCourse(courseData as any);

        const beforeDelete = await findCourseById(saved._id.toString());
        expect(beforeDelete).not.toBeNull();

        const deleted = await deleteCourse(saved._id.toString());
        expect(deleted).not.toBeNull();
        expect(deleted?.name).toBe("Curso de Node.js");

        const afterDelete = await findCourseById(saved._id.toString());
        expect(afterDelete).toBeNull();
    });
});
