import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Category from "../../data/mongo/models/category.model.js";
import { saveCategory } from "./save.category.mongo.js";
import { findCategoryByName } from "./findByName.category.mongo.js";

describe("Buscar categoría por nombre con Mongo", () => {
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

    it("Debería devolver la categoría existente por nombre", async () => {
        const categoryData = {
            name: "Tecnología",
            description: "Artículos sobre desarrollo y software",
        };

        await saveCategory(categoryData as any);

        const found = await findCategoryByName("Tecnología");

        expect(found).toBeDefined();
        expect(found.name).toBe(categoryData.name);
        expect(found.description).toBe(categoryData.description);
    });

    it("Debería lanzar error si la categoría no existe", async () => {
        await expect(findCategoryByName("Inexistente")).rejects.toThrow(
            /no existe/i
        );
    });
});
