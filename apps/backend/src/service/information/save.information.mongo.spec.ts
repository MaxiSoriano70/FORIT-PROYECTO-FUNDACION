import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Information from "../../data/mongo/models/information.model.js";
import { saveInformation } from "./save.information.mongo.js";
import { InformationStatus } from "../../utils/enums/informationStatus.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Guardar información con Mongo", () => {
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
        await Promise.all([User.deleteMany(), Course.deleteMany(), Information.deleteMany()]);
    });

    it("Debería crear información con estado INFORMAR si el usuario no existe", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Admin123!",
            phone: "+5491100000000",
            address: "Admin Street",
            role: UserRole.ADMIN,
        });

        const categoryId = new mongoose.Types.ObjectId();

        const course = await Course.create({
            name: "Node Avanzado",
            description: "Curso completo de backend avanzado con Node.js", // >= 10 chars
            durationMonths: 3,
            schedule: "Lunes y miércoles",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 150,
            maxCapacity: 25,
            adminId: admin._id,
            categoryId,
        });

        const info = await saveInformation({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            phone: "+5491112345678",
            courseId: course._id,
        });

        expect(info.status).toBe(InformationStatus.INFORMAR);
    });

    it("Debería crear información con estado USUARIOAINFORMAR si el usuario ya existe", async () => {
        const user = await User.create({
            firstName: "Carlos",
            lastName: "López",
            email: "carlos@example.com",
            password: "Pass123!",
            phone: "+5491198765432",
            address: "Calle Falsa 123",
            role: UserRole.STUDENT,
        });

        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin2@example.com",
            password: "Admin123!",
            phone: "+5491100000001",
            address: "Admin Street 2",
            role: UserRole.ADMIN,
        });

        const categoryId = new mongoose.Types.ObjectId();

        const course = await Course.create({
            name: "React Básico",
            description: "Curso introductorio de frontend con ReactJS", // >= 10 chars
            durationMonths: 3,
            schedule: "Martes y jueves",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            maxCapacity: 20,
            adminId: admin._id,
            categoryId,
        });

        const info = await saveInformation({
            firstName: "Carlos",
            lastName: "López",
            email: "carlos@example.com",
            phone: "+5491198765432",
            courseId: course._id,
        });

        expect(info.status).toBe(InformationStatus.USUARIOAINFORMAR);
    });

    it("Debería lanzar error si el curso no existe", async () => {
        const fakeCourseId = new mongoose.Types.ObjectId();

        await expect(
            saveInformation({
                firstName: "Ana",
                lastName: "García",
                email: "ana@example.com",
                phone: "+5491112345678",
                courseId: fakeCourseId,
            })
        ).rejects.toThrow(/curso/i);
    });
});
