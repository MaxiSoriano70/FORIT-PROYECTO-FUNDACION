import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { updateUserById } from "./update.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Actualizar usuario con Mongo", () => {
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

    it("Debería devolver null si el ID no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const updated = await updateUserById(fakeId, { firstName: "Nuevo" });
        expect(updated).toBeNull();
    });

    it("Debería actualizar correctamente los datos del usuario", async () => {
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

        const updates = {
            firstName: "Maximiliano",
            address: "Nueva Dirección 456",
        };

        const updated = await updateUserById(saved._id.toString(), updates);

        expect(updated).not.toBeNull();
        expect(updated?.firstName).toBe(updates.firstName);
        expect(updated?.address).toBe(updates.address);
        expect(updated?.email).toBe(userData.email);
    });
});
