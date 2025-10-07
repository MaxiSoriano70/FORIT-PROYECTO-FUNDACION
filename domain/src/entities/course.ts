import type { Entity } from "../utils/types/entity.js";

export interface Course extends Entity {
    name: string;
    description: string;
    durationMonths: number;
    schedule: string;
    startDate: Date;
    endDate: Date;
    pricePerMonth: number;
    adminId: string;
    teacherId: string;
}

export type SecureCourse = Omit<Course, "adminId">;