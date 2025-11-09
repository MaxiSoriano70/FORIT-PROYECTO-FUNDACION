import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { markQuotaPaid } from "./markQuotaPaid.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Marcar cuotas pagadas en una inscripción (Mongo)", () => {
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

    it("Debería lanzar un error si la inscripción no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();

        await expect(markQuotaPaid(fakeId)).rejects.toThrow("Inscripción no encontrada");
    });

    it("Debería incrementar el número de cuotas pagadas", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "1111111111",
        });

        const student = await User.create({
            firstName: "María",
            lastName: "Pérez",
            email: "maria@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "2222222222",
        });

        const course = await Course.create({
            name: "Curso de Spring Boot",
            description: "Desarrollo backend con Spring",
            durationMonths: 4,
            schedule: "Lunes y Miércoles 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-07-31"),
            pricePerMonth: 250,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 25,
            enrolledCount: 0,
        });

        const registration = await saveRegistration({
            studentId: student._id,
            courseId: course._id,
        });

        const updated = await markQuotaPaid(registration._id, 1);
        expect(updated.paidQuotas).toBe(1);

        const updated2 = await markQuotaPaid(registration._id, 2);
        expect(updated2.paidQuotas).toBe(3);
    });

    it("No debería exceder el total de cuotas del curso", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin2@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "3333333333",
        });

        const student = await User.create({
            firstName: "Carlos",
            lastName: "Gómez",
            email: "carlos@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "4444444444",
        });

        const course = await Course.create({
            name: "Curso de Node.js",
            description: "Backend moderno con Node.js",
            durationMonths: 3,
            schedule: "Martes y Jueves 18-20hs",
            startDate: new Date("2025-05-01"),
            endDate: new Date("2025-07-31"),
            pricePerMonth: 300,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 30,
            enrolledCount: 0,
        });

        const registration = await saveRegistration({
            studentId: student._id,
            courseId: course._id,
        });

        const updated = await markQuotaPaid(registration._id, 10);

        expect(updated.paidQuotas).toBeLessThanOrEqual(updated.totalQuotas);
        expect(updated.paidQuotas).toBe(updated.totalQuotas);
    });
});
