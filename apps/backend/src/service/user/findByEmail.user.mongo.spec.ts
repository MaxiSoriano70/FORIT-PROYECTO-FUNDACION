import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { findUserByEmail } from "./findByEmail.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar usuario por email con Mongo", () => {
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

    it("Debería devolver null si el email no existe", async () => {
        const result = await findUserByEmail("noexiste@example.com");
        expect(result).toBeNull();
    });

    it("Debería devolver el usuario correspondiente al email", async () => {
        const userData = {
            firstName: "Maxi",
            lastName: "Soriano",
            email: "maxi@example.com",
            password: "Pass123!",
            phone: "+5491122334455",
            address: "Calle Falsa 123",
            role: UserRole.STUDENT,
        };

        const saved = await saveUser(userData as any);

        const found = await findUserByEmail(userData.email);

        expect(found).not.toBeNull();
        expect(found?.email).toBe(userData.email);
        expect(found?.firstName).toBe(userData.firstName);
    });
});
