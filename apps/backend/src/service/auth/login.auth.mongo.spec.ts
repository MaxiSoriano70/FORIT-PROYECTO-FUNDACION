import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { login } from "./login.auth.mongo.js";
import bcrypt from "bcryptjs";
import { UserRole } from '../../utils/enums/userRole.js';


describe("Auth - Login", () => {
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
        await User.deleteMany();
    });

    it("Debería iniciar sesión correctamente con credenciales válidas", async () => {
        const password = "Pass123!";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            password: hashedPassword,
            role: UserRole.STUDENT,
            phone: "1111111111",
        });

        const result = await login("juan@example.com", password);
        expect(result).toBeDefined();
        expect(result.email).toBe(user.email);
    });

    it("Debería fallar si el email no existe", async () => {
        await expect(login("noexiste@example.com", "Pass123!")).rejects.toThrow(
            "Usuario no encontrado"
        );
    });

    it("Debería fallar si la contraseña es incorrecta", async () => {
        const password = "Pass123!";
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName: "Ana",
            lastName: "Gómez",
            email: "ana@example.com",
            password: hashedPassword,
            role: UserRole.STUDENT,
            phone: "2222222222",
        });

        await expect(login("ana@example.com", "WrongPass")).rejects.toThrow(
            "Contraseña incorrecta"
        );
    });
});
