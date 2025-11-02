import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { deleteUserById } from "./delete.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Eliminar usuario con Mongo", () => {
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
        const deleted = await deleteUserById(fakeId);
        expect(deleted).toBeNull();
    });

    it("Debería eliminar el usuario correctamente y devolver el documento eliminado", async () => {
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

        const deleted = await deleteUserById(saved._id.toString());

        expect(deleted).not.toBeNull();
        expect(deleted?.email).toBe(userData.email);

        const found = await User.findById(saved._id);
        expect(found).toBeNull();
    });
});
