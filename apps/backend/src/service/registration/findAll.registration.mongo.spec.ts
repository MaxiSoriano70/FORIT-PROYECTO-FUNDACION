import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { findAllRegistrations } from "./findAll.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Obtener todas las inscripciones con Mongo", () => {
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
            Registration.deleteMany()
        ]);
    });

    it("Debería devolver un arreglo vacío si no hay inscripciones", async () => {
        const regs = await findAllRegistrations();
        expect(regs).toBeInstanceOf(Array);
        expect(regs).toHaveLength(0);
    });

    it("Debería devolver todas las inscripciones guardadas", async () => {
        const student1 = await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT
        });

        const student2 = await User.create({
            firstName: "Ana",
            lastName: "Gómez",
            email: "ana@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT
        });

        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN
        });

        const course = await Course.create({
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
            enrolledCount: 0
        });

        await saveRegistration({ studentId: student1._id, courseId: course._id });
        await saveRegistration({ studentId: student2._id, courseId: course._id });

        const allRegs = await findAllRegistrations();

        expect(allRegs).toHaveLength(2);
        const studentIds = allRegs.map(r => r.studentId.toString());
        expect(studentIds).toContain(student1._id.toString());
        expect(studentIds).toContain(student2._id.toString());
    });
});
