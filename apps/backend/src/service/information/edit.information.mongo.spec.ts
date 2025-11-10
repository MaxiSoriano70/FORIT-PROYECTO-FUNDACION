import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Information from "../../data/mongo/models/information.model.js";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { editInformation } from "./edit.information.mongo.js";
import { InformationStatus } from "../../utils/enums/informationStatus.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Editar información con Mongo", () => {
    let mongoServer: MongoMemoryServer;
    let admin: any;
    let course1: any;
    let course2: any;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            phone: "111111111",
            role: UserRole.ADMIN,
        });

        course1 = await Course.create({
            name: "Curso de Node.js",
            description: "Backend con Node",
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

        course2 = await Course.create({
            name: "Curso de React",
            description: "Frontend moderno",
            durationMonths: 3,
            schedule: "Martes y Jueves 18-20hs",
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

    it("Debería editar correctamente el teléfono de la información", async () => {
        const info = await informationManager.save({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            phone: "123456789",
            courseId: course1._id,
            status: InformationStatus.INFORMAR,
        });

        const updated = await editInformation(info._id.toString(), { phone: "987654321" });

        expect(updated).not.toBeNull();
        expect(updated?.phone).toBe("987654321");
    });

    it("Debería actualizar el curso asociado si el nuevo curso existe", async () => {
        const info = await informationManager.save({
            firstName: "Ana",
            lastName: "García",
            email: "ana@example.com",
            phone: "222333444",
            courseId: course1._id,
            status: InformationStatus.INFORMAR,
        });

        const updated = await editInformation(info._id.toString(), { courseId: course2._id });

        expect(updated).not.toBeNull();
        expect(updated?.courseId.toString()).toBe(course2._id.toString());
    });

    it("Debería lanzar error si el curso nuevo no existe", async () => {
        const info = await informationManager.save({
            firstName: "Pedro",
            lastName: "Gómez",
            email: "pedro@example.com",
            phone: "555666777",
            courseId: course1._id,
            status: InformationStatus.INFORMAR,
        });

        const fakeCourseId = new mongoose.Types.ObjectId();

        await expect(editInformation(info._id.toString(), { courseId: fakeCourseId }))
            .rejects.toThrow(/curso/i);
    });
});
