import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { findUserByLastName } from "./findByLastName.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Buscar usuario por apellido (lastName) con Mongo", () => {
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

    it("Debería devolver null si el apellido no existe", async () => {
        const result = await findUserByLastName("Desconocido");
        expect(result).toBeNull();
    });

    it("Debería devolver el usuario correspondiente al apellido", async () => {
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

        const found = await findUserByLastName("Soriano");

        expect(found).not.toBeNull();
        expect(found?.lastName).toBe("Soriano");
        expect(found?.email).toBe(userData.email);
    });

    it("Debería devolver el primer usuario encontrado si hay varios con el mismo apellido", async () => {
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
                firstName: "Lucía",
                lastName: "Gómez",
                email: "lucia@example.com",
                password: "Pass123!",
                phone: "+541155566677",
                address: "Calle Nueva 456",
                role: UserRole.STUDENT,
            },
        ];

        for (const user of usersData) {
            await saveUser(user as any);
        }

        const found = await findUserByLastName("Gómez");

        expect(found).not.toBeNull();
        expect(found?.lastName).toBe("Gómez");
        expect(["ana@example.com", "lucia@example.com"]).toContain(found?.email);
    });
});
