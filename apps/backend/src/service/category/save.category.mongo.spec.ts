import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Category from "../../data/mongo/models/category.model.js";
import { saveCategory } from "./save.category.mongo.js";

describe("Guardar categoría con Mongo", () => {
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

    it("Debería guardar una nueva categoría", async () => {
        const categoryData = {
            name: "Tecnología",
            description: "Categoría para artículos de tecnología y software",
        };

        const saved = await saveCategory(categoryData as any);

        expect(saved).toBeDefined();
        expect(saved.name).toBe(categoryData.name);

        const all = await Category.find();
        expect(all).toHaveLength(1);
    });

    it("Debería lanzar error si la categoría ya existe", async () => {
        const categoryData = {
            name: "Educación",
            description: "Recursos y materiales educativos en general",
        };

        await saveCategory(categoryData as any);

        await expect(saveCategory(categoryData as any)).rejects.toThrowError(
            /ya existe/i
        );
    });
});
