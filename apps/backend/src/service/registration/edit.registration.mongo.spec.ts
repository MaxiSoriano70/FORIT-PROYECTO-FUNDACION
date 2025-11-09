import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { editRegistration } from "./edit.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "../../utils/enums/registrationStatus.js";

describe("Editar inscripción con Mongo", () => {
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

    it("Debería actualizar correctamente el estado de una inscripción", async () => {
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
            description: "Backend avanzado",
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

        const updated = await editRegistration(registration._id.toString(), { status: RegistrationStatus.ABANDONADO });

        expect(updated).not.toBeNull();
        expect(updated?.status).toBe(RegistrationStatus.ABANDONADO);
    });

    it("Debería recalcular cuotas y monto total si se cambia el curso", async () => {
        const student = await User.create({
            firstName: "Ana",
            lastName: "Gómez",
            email: "ana@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "3333333333",
        });

        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "4444444444",
        });

        const course1 = await Course.create({
            name: "Curso 1",
            description: "Curso 1 avanzado",
            durationMonths: 3,
            schedule: "Lunes",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 30,
            enrolledCount: 0
        });

        const course2 = await Course.create({
            name: "Curso 2",
            description: "Curso 2 avanzado",
            durationMonths: 5,
            schedule: "Martes",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 200,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 30,
            enrolledCount: 0
        });

        const registration = await saveRegistration({ studentId: student._id, courseId: course1._id });

        const updated = await editRegistration(registration._id.toString(), { courseId: course2._id });

        expect(updated).not.toBeNull();
        expect(updated?.courseId.toString()).toBe(course2._id.toString());
        expect(updated?.totalQuotas).toBe(course2.durationMonths);
        expect(updated?.pricePerQuota).toBe(course2.pricePerMonth);
        expect(updated?.totalAmount).toBe(course2.durationMonths * course2.pricePerMonth);
    });

    it("Debería lanzar error si se intenta asignar un estudiante inexistente o con rol incorrecto", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        await expect(editRegistration(fakeId.toString(), { studentId: fakeId }))
            .rejects.toThrow(/no existe|no es un STUDENT/);
    });

    it("Debería devolver null si la inscripción no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const result = await editRegistration(fakeId.toString(), { status: RegistrationStatus.ACTIVO });
        expect(result).toBeNull();
    });
});
