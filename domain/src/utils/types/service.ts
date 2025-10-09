import type { Entity } from "../types/entity.js";

export interface Service<T extends Entity> extends ServiceQuery<T>, ServiceStorage<T>{}

/* SEPARAR SERVICE QUE HACEB CANBIOS EN LA DB CON SERVICE QUE NO HACEN CAMBIOS EN LA DB */
interface ServiceQuery<T extends Entity> {
    findById: (id: string) => Promise<T | undefined>;
    findAll: () => Promise<T[]>;
}

interface ServiceStorage<T extends Entity> {
    editOne(data: T): Promise<T>;
    save(data: T): Promise<void>;
    deleteById(id: string): Promise<void>;
}
