import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Information from "../../data/mongo/models/information.model.js";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { deleteInformation } from "./delete.information.mongo.js";
import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { InformationStatus } from "../../utils/enums/informationStatus.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Eliminar información con Mongo", () => {
    let mongoServer: MongoMemoryServer;
    let admin: any;
    let course: any;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        // Crear usuario admin
        admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "111111111",
        });

        // Crear curso
        course = await Course.create({
            name: "Curso de MongoDB",
            description: "Aprende Mongo con Node.js",
            durationMonths: 2,
            schedule: "Martes y Jueves 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-05-31"),
            pricePerMonth: 150,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 20,
            enrolledCount: 0,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Information.deleteMany();
    });

    it("Debería devolver null si se intenta eliminar información inexistente", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const deleted = await deleteInformation(fakeId);
        expect(deleted).toBeNull();
    });

    it("Debería eliminar correctamente una información existente", async () => {
        const info = await informationManager.save({
            firstName: "Carlos",
            lastName: "Gómez",
            email: "carlos@example.com",
            phone: "123456789",
            courseId: course._id,
            status: InformationStatus.INFORMAR,
        });

        const beforeDelete = await informationManager.findById(info._id.toString());
        expect(beforeDelete).not.toBeNull();

        const deleted = await deleteInformation(info._id.toString());
        expect(deleted).not.toBeNull();
        expect(deleted?.email).toBe("carlos@example.com");

        const afterDelete = await informationManager.findById(info._id.toString());
        expect(afterDelete).toBeNull();
    });
});
