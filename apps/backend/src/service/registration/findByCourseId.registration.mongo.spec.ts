import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { findRegistrationsByCourseId } from "./findByCourseId.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar inscripciones por courseId con Mongo", () => {
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
            Course.deleteMany(),
            Registration.deleteMany(),
        ]);
    });

    it("Debería devolver un array vacío si el curso no tiene inscripciones", async () => {
        const fakeCourse = new mongoose.Types.ObjectId();
        const result = await findRegistrationsByCourseId(fakeCourse);
        expect(result).toEqual([]);
    });

    it("Debería devolver las inscripciones de un curso existente", async () => {
        const student1 = await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "111111111",
        });

        const student2 = await User.create({
            firstName: "Ana",
            lastName: "Gómez",
            email: "ana@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "222222222",
        });

        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "333333333",
        });

        const course = await Course.create({
            name: "Curso de Angular",
            description: "Frontend con Angular",
            durationMonths: 4,
            schedule: "Miércoles 18-20hs",
            startDate: new Date("2025-03-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 250,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 40,
            enrolledCount: 0,
        });

        await saveRegistration({ studentId: student1._id, courseId: course._id });
        await saveRegistration({ studentId: student2._id, courseId: course._id });

        const found = await findRegistrationsByCourseId(course._id);

        expect(found.length).toBe(2);
        expect(found[0]).toBeDefined();
        expect(found[0]!.courseId.toString()).toBe(course._id.toString());
    });
});
