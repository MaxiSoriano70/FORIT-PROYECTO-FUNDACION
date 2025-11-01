import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Category from "../../data/mongo/models/category.model.js";
import { saveCategory } from "./save.category.mongo.js";
import { findCategoryById } from "./findById.category.mongo.js";

describe("Buscar categoría por ID con Mongo", () => {
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

    it("Debería devolver una categoría existente por su ID", async () => {
        const categoryData = {
            name: "Deportes",
            description: "Categoría para artículos deportivos",
        };

        const created = await saveCategory(categoryData as any);
        const found = await findCategoryById(created._id.toString());

        expect(found).toBeDefined();
        expect(found._id.toString()).toBe(created._id.toString());
        expect(found.name).toBe(categoryData.name);
        expect(found.description).toBe(categoryData.description);
    });

    it("Debería lanzar error si la categoría no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        await expect(findCategoryById(fakeId)).rejects.toThrow(/no existe/i);
    });
});
