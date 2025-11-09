import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { finishCourse } from "./finishCourse.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "../../utils/enums/registrationStatus.js";

describe("Finalizar curso de una inscripción (Mongo)", () => {
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
        await Promise.all([
            User.deleteMany(),
            Course.deleteMany(),
            Registration.deleteMany(),
        ]);
    });

    it("Debería lanzar un error si la inscripción no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        await expect(finishCourse(fakeId)).rejects.toThrow("Inscripción no encontrada");
    });

    it("Debería marcar el curso como finalizado y actualizar el estado a COMPLETADO", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "1111111111",
        });

        const student = await User.create({
            firstName: "Laura",
            lastName: "Méndez",
            email: "laura@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "2222222222",
        });

        const course = await Course.create({
            name: "Curso de Spring Boot",
            description: "Desarrollo backend avanzado con Spring Boot",
            durationMonths: 4,
            schedule: "Martes y Jueves 19-21hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-07-31"),
            pricePerMonth: 250,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 25,
            enrolledCount: 0,
        });

        const registration = await saveRegistration({
            studentId: student._id,
            courseId: course._id,
        });

        const updated = await finishCourse(registration._id);

        expect(updated.courseFinished).toBe(true);
        expect(updated.status).toBe(RegistrationStatus.COMPLETADO);
        expect(updated.completionDate).toBeDefined();

        const dbReg = await Registration.findById(registration._id);
        expect(dbReg?.courseFinished).toBe(true);
        expect(dbReg?.status).toBe(RegistrationStatus.COMPLETADO);
        expect(dbReg?.completionDate).toBeInstanceOf(Date);
    });

    it("No debería modificar otras inscripciones del mismo estudiante", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin2@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "3333333333",
        });

        const student = await User.create({
            firstName: "Carlos",
            lastName: "Gómez",
            email: "carlos@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "4444444444",
        });

        const course1 = await Course.create({
            name: "Curso de Node.js",
            description: "Backend con Node.js",
            durationMonths: 3,
            schedule: "Lunes y Miércoles 18-20hs",
            startDate: new Date("2025-03-01"),
            endDate: new Date("2025-05-30"),
            pricePerMonth: 200,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 20,
            enrolledCount: 0,
        });

        const course2 = await Course.create({
            name: "Curso de Angular",
            description: "Frontend moderno con Angular",
            durationMonths: 3,
            schedule: "Martes y Jueves 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 220,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 20,
            enrolledCount: 0,
        });

        const reg1 = await saveRegistration({ studentId: student._id, courseId: course1._id });
        const reg2 = await saveRegistration({ studentId: student._id, courseId: course2._id });

        await finishCourse(reg1._id);

        const dbReg1 = await Registration.findById(reg1._id);
        const dbReg2 = await Registration.findById(reg2._id);

        expect(dbReg1?.courseFinished).toBe(true);
        expect(dbReg2?.courseFinished).toBeFalsy();
    });
});
