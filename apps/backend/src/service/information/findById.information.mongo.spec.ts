import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Information from "../../data/mongo/models/information.model.js";
import { saveInformation } from "./save.information.mongo.js";
import { findInformationById } from "./findById.information.mongo.js";
import { InformationStatus } from "../../utils/enums/informationStatus.js";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar solicitud de información por ID con Mongo", () => {
    let mongoServer: MongoMemoryServer;
    let admin: any;
    let course: any;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "111111111",
        });

        course = await Course.create({
            name: "Curso de Node.js",
            description: "Backend con Node.js y APIs",
            durationMonths: 3,
            schedule: "Lunes y Miércoles 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 200,
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

    it("Debería devolver una solicitud de información existente por su ID", async () => {
        const infoData = {
            firstName: "Laura",
            lastName: "Méndez",
            email: "laura@example.com",
            phone: "123456789",
            courseId: course._id,
            status: InformationStatus.INFORMAR,
        };

        const created: any = await saveInformation(infoData);

        const found = await findInformationById(created._id.toString());

        expect(found).toBeDefined();
        expect(found.firstName).toBe(infoData.firstName);
        expect(found.email).toBe(infoData.email);
        expect(found.status).toBe(InformationStatus.INFORMAR);
    });

    it("Debería lanzar error si la solicitud de información no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(findInformationById(fakeId)).rejects.toThrow(/no existe/i);
    });
});
