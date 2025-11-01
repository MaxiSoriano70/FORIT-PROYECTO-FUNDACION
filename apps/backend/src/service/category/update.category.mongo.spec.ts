import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Category from "../../data/mongo/models/category.model.js";
import { saveCategory } from "./save.category.mongo.js";
import { updateCategory } from "./update.category.mongo.js";

describe("Actualizar categoría con Mongo", () => {
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

    it("Debería actualizar correctamente una categoría existente", async () => {
        const categoryData = {
            name: "Tecnología",
            description: "Artículos sobre desarrollo y software",
        };

        const created = await saveCategory(categoryData as any);

        const updatedData = {
            name: "Tech",
            description: "Nueva descripción actualizada",
        };

        const updated = await updateCategory(created._id.toString(), updatedData as any);

        expect(updated).toBeDefined();
        expect(updated.name).toBe(updatedData.name);
        expect(updated.description).toBe(updatedData.description);
    });

    it("Debería lanzar error si la categoría no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        await expect(
            updateCategory(fakeId, { name: "Inexistente" } as any)
        ).rejects.toThrow(/no existe/i);
    });

    it("Debería lanzar error si el nuevo nombre ya está en uso", async () => {
        const cat1 = await saveCategory({
            name: "Educación",
            description: "Categoría educativa",
        } as any);

        const cat2 = await saveCategory({
            name: "Ciencia",
            description: "Categoría científica",
        } as any);

        await expect(
            updateCategory(cat2._id.toString(), { name: cat1.name } as any)
        ).rejects.toThrow(/ya existe/i);
    });
});
