import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Category from "../../data/mongo/models/category.model.js";
import { saveCategory } from "./save.category.mongo.js";
import { findAllCategories } from "./findAll.categories.mongo.js";

describe("Obtener todas las categorías con Mongo", () => {
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

    it("Debería devolver todas las categorías existentes", async () => {
        const categories = [
            { name: "Tecnología", description: "Artículos sobre tecnología" },
            { name: "Educación", description: "Recursos educativos" },
            { name: "Cocina", description: "Recetas y utensilios" },
        ];

        for (const c of categories) {
            await saveCategory(c as any);
        }

        const all = await findAllCategories();

        expect(all).toHaveLength(3);
        const names = all.map((c) => c.name);
        expect(names).toContain("Tecnología");
        expect(names).toContain("Educación");
        expect(names).toContain("Cocina");
    });

    it("Debería lanzar error si no hay categorías", async () => {
        await expect(findAllCategories()).rejects.toThrow(/no hay categorías/i);
    });
});
