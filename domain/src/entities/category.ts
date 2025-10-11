import { Entity } from "../utils/types/entity";

export interface Category extends Entity {
    name: string;
    description: string;
}