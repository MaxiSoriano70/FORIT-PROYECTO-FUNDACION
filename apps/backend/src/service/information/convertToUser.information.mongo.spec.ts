import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Information from "../../data/mongo/models/information.model.js";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { convertToUser } from "./convertToUser.information.mongo.js";
import { informationManager } from "../../data/mongo/managers/information/information.manager.js";
import { InformationStatus } from "../../utils/enums/informationStatus.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Convertir solicitud de información en usuario con Mongo", () => {
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

        // Crear curso de prueba
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
        await User.deleteMany({ role: UserRole.STUDENT });
    });

    it("Debería convertir correctamente una solicitud en usuario", async () => {
        // Crear solicitud de información
        const info = await informationManager.save({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juanperez@example.com",
            phone: "123456789",
            courseId: course._id,
            status: InformationStatus.INFORMAR,
        });

        // Ejecutar caso de uso
        const result = await convertToUser(info._id.toString());

        // Validaciones
        expect(result.user).toBeDefined();
        expect(result.user.email).toBe("juanperez@example.com");
        expect(result.user.password).toBe("Perez_1234");
        expect(result.user.role).toBe(UserRole.STUDENT);

        expect(result.info).not.toBeNull();
        expect(result.info!.status).toBe(InformationStatus.INFORMADO);

        // Limpieza
        await User.deleteOne({ _id: result.user._id });
        await Information.deleteOne({ _id: info._id });
    });

    it("Debería lanzar error si la información no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(convertToUser(fakeId)).rejects.toThrow(/no se encontró/i);
    });

    it("Debería lanzar error si ya existe un usuario con el mismo email", async () => {
        // Crear usuario existente
        await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juanperez@example.com",
            password: "Perez_1234",
            role: UserRole.STUDENT,
            phone: "123456789",
        });

        // Crear solicitud con el mismo email
        const info = await informationManager.save({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juanperez@example.com",
            phone: "123456789",
            courseId: course._id,
            status: InformationStatus.INFORMAR,
        });

        // Ejecutar y esperar error
        await expect(convertToUser(info._id.toString())).rejects.toThrow(/ya existe un usuario/i);
    });

    it("Debería lanzar error si el curso asociado no existe", async () => {
        const info = await informationManager.save({
            firstName: "Ana",
            lastName: "García",
            email: "ana@example.com",
            phone: "987654321",
            courseId: new mongoose.Types.ObjectId(), // curso inexistente
            status: InformationStatus.INFORMAR,
        });

        await expect(convertToUser(info._id.toString())).rejects.toThrow(/curso asociado ya no existe/i);
    });
});
