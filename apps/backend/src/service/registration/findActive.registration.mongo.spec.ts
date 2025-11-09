import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { findActive } from "./findActive.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "../../utils/enums/registrationStatus.js";

describe("Obtener inscripciones activas con Mongo", () => {
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

    it("Debería devolver solo inscripciones con estado ACTIVO", async () => {
        // Crear usuarios
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
            name: "Curso Node.js",
            description: "Backend completo con Node.js",
            durationMonths: 6,
            schedule: "Lunes 18-20hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 150,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 50,
            enrolledCount: 0
        });

        const activeReg = await saveRegistration({ studentId: student._id, courseId: course._id });

        const inactiveReg = new Registration({
            studentId: student._id,
            courseId: course._id,
            enrollmentDate: new Date(),
            status: RegistrationStatus.ABANDONADO,
            courseFinished: false,
            totalQuotas: 6,
            paidQuotas: 0,
            pricePerQuota: 150,
            totalAmount: 900
        });
        await inactiveReg.save();

        const activeRegs = await findActive();

        const firstReg = activeRegs[0] as typeof activeRegs[0] & { _id: string };

        expect(firstReg).toBeDefined();
        expect(firstReg._id.toString()).toBe(activeReg._id.toString());
        expect(firstReg.status).toBe(RegistrationStatus.ACTIVO);
    });


    it("Debería devolver un array vacío si no hay inscripciones activas", async () => {
        const regs = await findActive();
        expect(regs).toEqual([]);
    });
});
