import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Course from "../../data/mongo/models/course.model.js";
import Registration from "../../data/mongo/models/registration.model.js";
import { saveRegistration } from "./save.registration.mongo.js";
import { countActiveByCourseId } from "./countActiveByCourseId.registration.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "../../utils/enums/registrationStatus.js";

describe("Contar inscripciones activas por courseId con Mongo", () => {
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

    it("Debería devolver 0 si el curso no tiene inscripciones", async () => {
        const fakeCourse = new mongoose.Types.ObjectId();
        const count = await countActiveByCourseId(fakeCourse);
        expect(count).toBe(0);
    });

    it("Debería contar correctamente las inscripciones activas", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            role: UserRole.ADMIN,
            phone: "111111111",
        });

        const student1 = await User.create({
            firstName: "Laura",
            lastName: "Méndez",
            email: "laura@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "222222222",
        });

        const student2 = await User.create({
            firstName: "Pedro",
            lastName: "López",
            email: "pedro@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "333333333",
        });

        const student3 = await User.create({
            firstName: "Lucía",
            lastName: "García",
            email: "lucia@example.com",
            password: "Pass123!",
            role: UserRole.STUDENT,
            phone: "444444444",
        });

        const course = await Course.create({
            name: "Curso de Node.js",
            description: "Backend con Node.js",
            durationMonths: 3,
            schedule: "Lunes y Miércoles 18-20hs",
            startDate: new Date("2025-04-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 200,
            categoryId: new mongoose.Types.ObjectId(),
            adminId: admin._id,
            maxCapacity: 25,
            enrolledCount: 0,
        });

        const reg1 = await saveRegistration({ studentId: student1._id, courseId: course._id });
        const reg2 = await saveRegistration({ studentId: student2._id, courseId: course._id });
        const reg3 = await saveRegistration({ studentId: student3._id, courseId: course._id });

        await Registration.findByIdAndUpdate(reg3._id, { status: RegistrationStatus.ABANDONADO });

        const count = await countActiveByCourseId(course._id);
        expect(count).toBe(2);
    });
});
