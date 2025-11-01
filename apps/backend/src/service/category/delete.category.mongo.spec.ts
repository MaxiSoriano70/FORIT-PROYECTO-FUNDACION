import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Category from "../../data/mongo/models/category.model.js";
import { saveCategory } from "./save.category.mongo.js";
import { deleteCategory } from "./delete.category.mongo.js";

describe("Eliminar categoría con Mongo", () => {
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
        await Category.deleteMany();
    });

    it("Debería eliminar correctamente una categoría existente", async () => {
        const categoryData = {
            name: "Tecnología",
            description: "Artículos sobre desarrollo y software",
        };

        const created = await saveCategory(categoryData as any);

        const deleted = await deleteCategory(created._id.toString());
        expect(deleted).toBeDefined();
        expect(deleted.name).toBe(categoryData.name);

        const found = await Category.findById(created._id);
        expect(found).toBeNull();
    });

    it("Debería lanzar error si la categoría no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        await expect(deleteCategory(fakeId)).rejects.toThrow(/no existe/i);
    });
});
