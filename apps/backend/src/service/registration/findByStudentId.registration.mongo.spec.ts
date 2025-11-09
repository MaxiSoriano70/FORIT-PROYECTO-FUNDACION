import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";

import { findRegistrationsByStudentId } from "./findByStudentId.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { saveRegistration } from "./save.registration.mongo.js";

describe("Buscar inscripciones por studentId con Mongo", () => {
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

    it("Debería devolver un array vacío si el estudiante no tiene inscripciones", async () => {
        const fakeStudent = new mongoose.Types.ObjectId();
        const result = await findRegistrationsByStudentId(fakeStudent);
        expect(result).toEqual([]);
    });

    it("Debería devolver las inscripciones de un estudiante existente", async () => {
        const student = await User.create({
            firstName: "Ana",
            lastName: "López",
            email: "ana@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "123456789",
        });

        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "987654321",
        });

        const course1 = await Course.create({
            name: "Curso de React",
            description: "Frontend con React",
            durationMonths: 3,
            schedule: "Martes 18-20hs",
            startDate: new Date("2025-02-01"),
            endDate: new Date("2025-04-30"),
            pricePerMonth: 200,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 30,
            enrolledCount: 0,
        });

        const course2 = await Course.create({
            name: "Curso de Node.js",
            description: "Backend con Node",
            durationMonths: 6,
            schedule: "Lunes 18-20hs",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 150,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 50,
            enrolledCount: 0,
        });

        await saveRegistration({ studentId: student._id, courseId: course1._id });
        await saveRegistration({ studentId: student._id, courseId: course2._id });

        const found = await findRegistrationsByStudentId(student._id);

        expect(found.length).toBe(2);
        expect(found[0]).toBeDefined();
        expect(found[0]!.studentId.toString()).toBe(student._id.toString());
    });
});
