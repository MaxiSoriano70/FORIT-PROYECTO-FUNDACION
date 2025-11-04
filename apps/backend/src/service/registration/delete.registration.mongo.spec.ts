import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { deleteRegistration } from "./delete.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Eliminar inscripción con Mongo", () => {
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
        await Promise.all([User.deleteMany(), Course.deleteMany(), Registration.deleteMany()]);
    });

    it("Debería eliminar una inscripción existente", async () => {
        const student = await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
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
            name: "Curso Node.js",
            description: "Backend",
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

        const deleted = await deleteRegistration(registration._id.toString());

        expect(deleted).not.toBeNull();
        expect(deleted?._id.toString()).toBe(registration._id.toString());

        const all = await Registration.find();
        expect(all).toHaveLength(0);
    });

    it("Debería devolver null si la inscripción no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const deleted = await deleteRegistration(fakeId.toString());
        expect(deleted).toBeNull();
    });
});
