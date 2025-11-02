import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { findAllUsers } from "./findAll.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Obtener todos los usuarios con Mongo", () => {
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

    it("Debería devolver un arreglo vacío si no hay usuarios", async () => {
        const users = await findAllUsers();
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(0);
    });

    it("Debería devolver todos los usuarios guardados", async () => {
        const usersData = [
            {
                firstName: "Maxi",
                lastName: "Soriano",
                email: "maxi@example.com",
                password: "Pass123!",
                phone: "+5491122334455",
                address: "Calle Falsa 123",
                role: UserRole.STUDENT,
            },
            {
                firstName: "Ana",
                lastName: "Gómez",
                email: "ana@example.com",
                password: "Pass123!",
                phone: "+541112223334",
                address: "Av. Siempre Viva 742",
                role: UserRole.TEACHER,
            },
        ];

        for (const user of usersData) {
            await saveUser(user as any);
        }

        const all = await findAllUsers();

        expect(all).toHaveLength(2);
        const emails = all.map(u => u.email);
        expect(emails).toContain("maxi@example.com");
        expect(emails).toContain("ana@example.com");
    });
});
