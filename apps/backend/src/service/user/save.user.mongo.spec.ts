import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Guardar usuario con Mongo", () => {
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
        await User.deleteMany();
    });

    it("Debería guardar un nuevo usuario", async () => {
        const userData = {
            firstName: "Maximiliano",
            lastName: "Soriano",
            email: "maxi@example.com",
            password: "Pass123!",
            phone: "+5491122334455",
            address: "Calle Falsa 123",
            role: UserRole.STUDENT,
        };

        const saved = await saveUser(userData as any);

        expect(saved).toBeDefined();
        expect(saved.email).toBe(userData.email);

        const all = await User.find();
        expect(all).toHaveLength(1);
    });

    it("Debería lanzar error si el email ya existe", async () => {
        const userData = {
            firstName: "Ana",
            lastName: "Gómez",
            email: "ana@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Siempre Viva 742",
            role: UserRole.TEACHER,
        };

        await saveUser(userData as any);

        await expect(saveUser(userData as any)).rejects.toThrowError(/ya existe/i);
    });
});
