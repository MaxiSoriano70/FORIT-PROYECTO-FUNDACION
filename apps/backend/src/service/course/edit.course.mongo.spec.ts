import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Category from "../../data/mongo/models/category.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { saveCourse } from "./save.course.mongo.js";
import { editCourse } from "./edit.course.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Editar curso con Mongo", () => {
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
            Category.deleteMany(),
            Course.deleteMany()
        ]);
    });

    it("Debería editar correctamente el nombre de un curso", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Admin 101",
            role: UserRole.ADMIN
        });

        const teacher = await User.create({
            firstName: "Profesor",
            lastName: "García",
            email: "teacher@example.com",
            password: "Pass123!",
            phone: "+541199887766",
            address: "Calle Docente 456",
            role: UserRole.TEACHER
        });

        const category = await Category.create({
            name: "Programación",
            description: "Cursos sobre desarrollo de software"
        });

        const courseData = {
            name: "Curso de Node.js",
            description: "Aprende backend con Node.js",
            durationMonths: 6,
            schedule: "Lunes y Miércoles 18-20hs",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 150,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 50,
            enrolledCount: 0
        };

        const saved = await saveCourse(courseData as any);

        const updated = await editCourse(saved._id.toString(), { name: "Curso de Node.js Avanzado" });

        expect(updated).not.toBeNull();
        expect(updated?.name).toBe("Curso de Node.js Avanzado");
    });

    it("Debería lanzar error si se intenta asignar una categoría inexistente", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Admin 101",
            role: UserRole.ADMIN
        });

        const teacher = await User.create({
            firstName: "Profesor",
            lastName: "García",
            email: "teacher@example.com",
            password: "Pass123!",
            phone: "+541199887766",
            address: "Calle Docente 456",
            role: UserRole.TEACHER
        });

        const category = await Category.create({
            name: "Frontend",
            description: "React y Angular"
        });

        const courseData = {
            name: "Curso de React",
            description: "Frontend moderno",
            durationMonths: 4,
            schedule: "Martes y Jueves 18-20hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 120,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 40,
            enrolledCount: 0
        };

        const saved = await saveCourse(courseData as any);

        const fakeCategoryId = new mongoose.Types.ObjectId();

        await expect(editCourse(saved._id.toString(), { categoryId: fakeCategoryId }))
            .rejects.toThrow(/categoría/i);
    });

    it("Debería lanzar error si el nuevo teacher no tiene rol de TEACHER", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Admin 101",
            role: UserRole.ADMIN
        });

        const teacher = await User.create({
            firstName: "Profesor",
            lastName: "García",
            email: "teacher@example.com",
            password: "Pass123!",
            phone: "+541199887766",
            address: "Calle Docente 456",
            role: UserRole.TEACHER
        });

        const student = await User.create({
            firstName: "Alumno",
            lastName: "López",
            email: "alumno@example.com",
            password: "Pass123!",
            phone: "+541112224445",
            address: "Calle 123",
            role: UserRole.STUDENT
        });

        const category = await Category.create({
            name: "Backend",
            description: "Cursos de APIs"
        });

        const saved = await saveCourse({
            name: "Curso de Express",
            description: "Aprende APIs con Express",
            durationMonths: 3,
            schedule: "Lunes y Miércoles 19hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 50,
            enrolledCount: 0
        } as any);

        await expect(editCourse(saved._id.toString(), { teacherId: student._id }))
            .rejects.toThrow(/TEACHER/i);
    });
});
