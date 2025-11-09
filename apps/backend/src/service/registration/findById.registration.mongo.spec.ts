import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { findRegistrationById } from "./findById.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar inscripción por ID con Mongo", () => {
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

    it("Debería devolver null si no existe la inscripción", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const reg = await findRegistrationById(fakeId);
        expect(reg).toBeNull();
    });

    it("Debería encontrar una inscripción por su ID", async () => {
        const student = await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "1111111111",
        });

        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "2222222222",
        });

        const course = await Course.create({
            name: "Curso de Node.js",
            description: "Backend completo con Node.js",
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

        const registration = await saveRegistration({ studentId: student._id, courseId: course._id });

        const found = await findRegistrationById(registration._id);

        expect(found).not.toBeNull();
        expect(found?._id.toString()).toBe(registration._id.toString());
        expect(found?.studentId.toString()).toBe(student._id.toString());
    });
});
