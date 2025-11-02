import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { findUserByFirstName } from "./findByFirstName.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar usuario por nombre (firstName) con Mongo", () => {
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

    it("Debería devolver null si el nombre no existe", async () => {
        const result = await findUserByFirstName("Desconocido");
        expect(result).toBeNull();
    });

    it("Debería devolver el usuario correspondiente al nombre", async () => {
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

        const found = await findUserByFirstName("Maxi");

        expect(found).not.toBeNull();
        expect(found?.firstName).toBe("Maxi");
        expect(found?.email).toBe(userData.email);
    });

    it("Debería devolver el primer usuario encontrado si hay varios con el mismo nombre", async () => {
        const usersData = [
            {
                firstName: "Ana",
                lastName: "Gómez",
                email: "ana@example.com",
                password: "Pass123!",
                phone: "+541112223334",
                address: "Av. Siempre Viva 742",
                role: UserRole.TEACHER,
            },
            {
                firstName: "Ana",
                lastName: "López",
                email: "ana.lopez@example.com",
                password: "Pass123!",
                phone: "+541199988877",
                address: "Calle Nueva 456",
                role: UserRole.STUDENT,
            },
        ];

        for (const user of usersData) {
            await saveUser(user as any);
        }

        const found = await findUserByFirstName("Ana");

        expect(found).not.toBeNull();
        expect(found?.firstName).toBe("Ana");
        expect(["ana@example.com", "ana.lopez@example.com"]).toContain(found?.email);
    });
});
