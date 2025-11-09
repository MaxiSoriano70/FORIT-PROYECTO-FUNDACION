import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "../../utils/enums/registrationStatus.js";
import { findIncomplete } from "./findIncomplete.registration.mongo.js";

describe("Obtener inscripciones incompletas con Mongo", () => {
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

    it("Debería devolver solo inscripciones con courseFinished=false", async () => {
        // Crear usuario y curso
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

        // Inscripción incompleta
        const incompleteReg = await saveRegistration({ studentId: student._id, courseId: course._id });

        // Inscripción completa manualmente
        const completeReg = new Registration({
            studentId: student._id,
            courseId: course._id,
            enrollmentDate: new Date(),
            status: RegistrationStatus.COMPLETADO,
            courseFinished: true,
            totalQuotas: 6,
            paidQuotas: 6,
            pricePerQuota: 150,
            totalAmount: 900
        });
        await completeReg.save();

        const incompletes = await findIncomplete();

        // Type assertion para TypeScript
        const firstReg = incompletes[0] as typeof incompletes[0] & { _id: string };

        expect(incompletes).toHaveLength(1);
        expect(firstReg._id.toString()).toBe(incompleteReg._id.toString());
        expect(firstReg.courseFinished).toBe(false);
    });

    it("Debería devolver array vacío si no hay inscripciones incompletas", async () => {
        const regs = await findIncomplete();
        expect(regs).toEqual([]);
    });
});
