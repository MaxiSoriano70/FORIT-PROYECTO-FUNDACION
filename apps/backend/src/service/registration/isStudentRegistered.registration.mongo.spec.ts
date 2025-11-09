import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { isStudentRegistered } from "./isStudentRegistered.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Verificar si un estudiante está inscrito en un curso (Mongo)", () => {
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

    it("Debería devolver false si el estudiante no está inscrito", async () => {
        const fakeCourse = new mongoose.Types.ObjectId();
        const fakeStudent = new mongoose.Types.ObjectId();

        const isRegistered = await isStudentRegistered(fakeCourse, fakeStudent);
        expect(isRegistered).toBe(false);
    });

    it("Debería devolver true si el estudiante está inscrito en el curso", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "111111111",
        });

        const student = await User.create({
            firstName: "Sofía",
            lastName: "Martínez",
            email: "sofia@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "222222222",
        });

        const course = await Course.create({
            name: "Curso de React",
            description: "Frontend avanzado con React",
            durationMonths: 3,
            schedule: "Martes y Jueves 18-20hs",
            startDate: new Date("2025-05-01"),
            endDate: new Date("2025-07-31"),
            pricePerMonth: 300,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 30,
            enrolledCount: 0,
        });

        await saveRegistration({ studentId: student._id, courseId: course._id });

        const isRegistered = await isStudentRegistered(course._id, student._id);
        expect(isRegistered).toBe(true);
    });

    it("Debería devolver false si el estudiante existe pero está inscrito en otro curso", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin2@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "333333333",
        });

        const student = await User.create({
            firstName: "Carlos",
            lastName: "Gómez",
            email: "carlos@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "444444444",
        });

        const course1 = await Course.create({
            name: "Curso de Java",
            description: "Programación con Java 21",
            durationMonths: 4,
            schedule: "Lunes 18-21hs",
            startDate: new Date("2025-03-10"),
            endDate: new Date("2025-07-01"),
            pricePerMonth: 250,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 25,
            enrolledCount: 0,
        });

        const course2 = await Course.create({
            name: "Curso de Angular",
            description: "Frontend con Angular 18",
            durationMonths: 3,
            schedule: "Miércoles 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 270,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 25,
            enrolledCount: 0,
        });

        await saveRegistration({ studentId: student._id, courseId: course1._id });

        const isRegistered = await isStudentRegistered(course2._id, student._id);
        expect(isRegistered).toBe(false);
    });
});
