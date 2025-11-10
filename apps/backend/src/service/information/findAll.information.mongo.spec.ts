import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Information from "../../data/mongo/models/information.model.js";
import { findAllInformation } from "./findAll.information.mongo.js";
import { InformationStatus } from "../../utils/enums/informationStatus.js";
import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import Course from "../../data/mongo/models/course.model.js";
import User from "../../data/mongo/models/user.model.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Obtener todas las solicitudes de información con Mongo", () => {
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
            name: "Curso de Backend",
            description: "Aprende Node.js",
            durationMonths: 3,
            schedule: "Lunes y Miércoles 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 200,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 30,
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

    it("Debería devolver todas las solicitudes de información existentes", async () => {
        const infos = [
            {
                firstName: "Laura",
                lastName: "Méndez",
                email: "laura@example.com",
                phone: "111111111",
                courseId: course._id,
                status: InformationStatus.INFORMAR,
            },
            {
                firstName: "Pedro",
                lastName: "López",
                email: "pedro@example.com",
                phone: "222222222",
                courseId: course._id,
                status: InformationStatus.INFORMAR,
            },
            {
                firstName: "Lucía",
                lastName: "García",
                email: "lucia@example.com",
                phone: "333333333",
                courseId: course._id,
                status: InformationStatus.INFORMADO,
            },
        ];

        for (const info of infos) {
            await informationManager.save(info as any);
        }

        const all = await findAllInformation();

        expect(all).toHaveLength(3);
        const emails = all.map((i) => i.email);
        expect(emails).toContain("laura@example.com");
        expect(emails).toContain("pedro@example.com");
        expect(emails).toContain("lucia@example.com");
    });

    it("Debería lanzar error si no hay solicitudes de información", async () => {
        await expect(findAllInformation()).rejects.toThrow(/no hay solicitudes/i);
    });
});
