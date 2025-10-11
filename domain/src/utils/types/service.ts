import type { Entity } from "../types/entity.js";

export interface Service<T extends Entity> extends ServiceQuery<T>, ServiceStorage<T>{}

/* SEPARAR SERVICE QUE HACEB CANBIOS EN LA DB CON SERVICE QUE NO HACEN CAMBIOS EN LA DB */
interface ServiceQuery<T extends Entity> {
    findAll: () => Promise<T[]>;
    findById: (id: string) => Promise<T | undefined>;
}

interface ServiceStorage<T extends Entity> {
    editOne: (id: string, data: Partial<T>) => Promise<T>;
    save(data: T): Promise<void>;
    deleteById(id: string): Promise<void>;
}
