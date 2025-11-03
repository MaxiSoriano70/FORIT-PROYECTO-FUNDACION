import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import Category from "../../data/mongo/models/category.model.js";
import Course from "../../data/mongo/models/course.model.js";
import { saveCourse } from "./save.course.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Guardar curso con Mongo", () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
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

    it("Debería guardar un curso correctamente con admin y teacher válidos", async () => {
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
            description: "Aprende backend con Node.js de forma práctica",
            durationMonths: 6,
            schedule: "Lunes y Miércoles de 18 a 20hs",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-06-30"),
            pricePerMonth: 150,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: teacher._id,
            maxCapacity: 50,
            enrolledCount: 0
        };

        const savedCourse = await saveCourse(courseData as any);

        expect(savedCourse).toBeDefined();
        expect(savedCourse.name).toBe(courseData.name);

        const all = await Course.find();
        expect(all).toHaveLength(1);
    });

    it("Debería lanzar error si la categoría no existe", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin2@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Admin 101",
            role: UserRole.ADMIN
        });

        const fakeCategoryId = new mongoose.Types.ObjectId();

        const courseData = {
            name: "Curso sin categoría",
            description: "No debería guardarse",
            durationMonths: 3,
            schedule: "Martes y Jueves 18hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: fakeCategoryId,
            adminId: admin._id,
            maxCapacity: 30,
            enrolledCount: 0
        };

        await expect(saveCourse(courseData as any)).rejects.toThrow(/categoría/i);
    });

    it("Debería lanzar error si el admin no existe", async () => {
        const category = await Category.create({
            name: "Diseño",
            description: "Categoría de prueba"
        });

        const fakeAdminId = new mongoose.Types.ObjectId();

        const courseData = {
            name: "Curso sin admin",
            description: "No debería guardarse",
            durationMonths: 3,
            schedule: "Martes 19hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: category._id,
            adminId: fakeAdminId,
            maxCapacity: 20,
            enrolledCount: 0
        };

        await expect(saveCourse(courseData as any)).rejects.toThrow(/administrador/i);
    });

    it("Debería lanzar error si el admin no tiene rol de ADMIN", async () => {
        const category = await Category.create({
            name: "Matemática",
            description: "Categoría de prueba"
        });

        const nonAdmin = await User.create({
            firstName: "Pedro",
            lastName: "Usuario",
            email: "pedro@example.com",
            password: "Pass123!",
            phone: "+541199887766",
            address: "Calle 1",
            role: UserRole.TEACHER
        });

        const courseData = {
            name: "Curso inválido",
            description: "Admin no válido",
            durationMonths: 3,
            schedule: "Martes 19hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: category._id,
            adminId: nonAdmin._id,
            maxCapacity: 20,
            enrolledCount: 0
        };

        await expect(saveCourse(courseData as any)).rejects.toThrow(/ADMIN/i);
    });

    it("Debería lanzar error si el teacher no existe", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Admin 101",
            role: UserRole.ADMIN
        });

        const category = await Category.create({
            name: "Backend",
            description: "Desarrollo con Node"
        });

        const fakeTeacherId = new mongoose.Types.ObjectId();

        const courseData = {
            name: "Curso con teacher inexistente",
            description: "No debería guardarse",
            durationMonths: 3,
            schedule: "Martes 19hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: fakeTeacherId,
            maxCapacity: 20,
            enrolledCount: 0
        };

        await expect(saveCourse(courseData as any)).rejects.toThrow(/profesor/i);
    });

    it("Debería lanzar error si el teacher no tiene rol de TEACHER", async () => {
        const admin = await User.create({
            firstName: "Admin",
            lastName: "Root",
            email: "admin@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Admin 101",
            role: UserRole.ADMIN
        });

        const student = await User.create({
            firstName: "Alumno",
            lastName: "Pérez",
            email: "alumno@example.com",
            password: "Pass123!",
            phone: "+541199887766",
            address: "Calle 9",
            role: UserRole.STUDENT
        });

        const category = await Category.create({
            name: "Frontend",
            description: "Categoría de prueba"
        });

        const courseData = {
            name: "Curso inválido",
            description: "Teacher sin rol TEACHER",
            durationMonths: 3,
            schedule: "Martes 19hs",
            startDate: new Date(),
            endDate: new Date(),
            pricePerMonth: 100,
            categoryId: category._id,
            adminId: admin._id,
            teacherId: student._id,
            maxCapacity: 20,
            enrolledCount: 0
        };

        await expect(saveCourse(courseData as any)).rejects.toThrow(/TEACHER/i);
    });
});
