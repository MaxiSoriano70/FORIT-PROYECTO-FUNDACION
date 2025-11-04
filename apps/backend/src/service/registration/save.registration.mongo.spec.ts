import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "../../utils/enums/registrationStatus.js";

describe("Guardar inscripción con Mongo", () => {
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
            Registration.deleteMany()
        ]);
    });

    it("Debería guardar una inscripción correctamente", async () => {
        const student = await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT
        });

        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN
        });

        const course = await Course.create({
            name: "Curso de Node.js",
            description: "Backend con Node",
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

        const registration = await saveRegistration({
            studentId: student._id,
            courseId: course._id
        });

        expect(registration).toBeDefined();
        expect(registration.studentId.toString()).toBe(student._id.toString());
        expect(registration.courseId.toString()).toBe(course._id.toString());
        expect(registration.totalQuotas).toBe(course.durationMonths);
        expect(registration.pricePerQuota).toBe(course.pricePerMonth);
        expect(registration.totalAmount).toBe(course.durationMonths * course.pricePerMonth);
        expect(registration.paidQuotas).toBe(0);
        expect(registration.status).toBe(RegistrationStatus.ACTIVO);
        expect(registration.courseFinished).toBe(false);

        const all = await Registration.find();
        expect(all).toHaveLength(1);
    });

    it("Debería lanzar error si el usuario no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const course = await Course.create({
            name: "Curso de prueba",
            description: "Backend",
            durationMonths: 3,
            schedule: "Martes 18hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: new mongoose.Types.ObjectId(),
            maxCapacity: 20,
            enrolledCount: 0
        });

        await expect(saveRegistration({ studentId: fakeId, courseId: course._id }))
            .rejects.toThrow(/no existe/);
    });

    it("Debería lanzar error si el usuario no es STUDENT", async () => {
        const teacher = await User.create({
            firstName: "Profesor",
            lastName: "García",
            email: "teacher@example.com",
            password: "Pass123!",
            role: UserRole.TEACHER
        });

        const course = await Course.create({
            name: "Curso de prueba",
            description: "Backend",
            durationMonths: 3,
            schedule: "Martes 18hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: new mongoose.Types.ObjectId(),
            maxCapacity: 20,
            enrolledCount: 0
        });

        await expect(saveRegistration({ studentId: teacher._id, courseId: course._id }))
            .rejects.toThrow(/no es un STUDENT/);
    });

    it("Debería lanzar error si el curso no existe", async () => {
        const student = await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan2@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT
        });

        const fakeCourseId = new mongoose.Types.ObjectId();

        await expect(saveRegistration({ studentId: student._id, courseId: fakeCourseId }))
            .rejects.toThrow(/no existe/);
    });
});
