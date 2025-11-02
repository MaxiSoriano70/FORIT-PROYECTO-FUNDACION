import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../data/mongo/models/user.model.js";
import { saveUser } from "./save.user.mongo.js";
import { changeUserRole } from "./changeRole.user.mongo.js";
import { UserRole } from "../../utils/enums/userRole.js";

describe("Cambiar rol de usuario con Mongo", () => {
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

    it("Debería devolver null si el usuario no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const updated = await changeUserRole(fakeId, UserRole.TEACHER);
        expect(updated).toBeNull();
    });

    it("Debería actualizar correctamente el rol del usuario", async () => {
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

        const updated = await changeUserRole(saved._id.toString(), UserRole.TEACHER);

        expect(updated).not.toBeNull();
        expect(updated?.role).toBe(UserRole.TEACHER);
        expect(updated?.email).toBe(userData.email);
    });

    it("Debería lanzar un error si el rol no es válido", async () => {
        const userData = {
            firstName: "Ana",
            lastName: "Gómez",
            email: "ana@example.com",
            password: "Pass123!",
            phone: "+541112223334",
            address: "Av. Siempre Viva 742",
            role: UserRole.STUDENT,
        };

        const saved = await saveUser(userData as any);

        await expect(
            changeUserRole(saved._id.toString(), "INVALID_ROLE" as unknown as UserRole)
        ).rejects.toThrow(/Rol inválido/i);

    });
});
