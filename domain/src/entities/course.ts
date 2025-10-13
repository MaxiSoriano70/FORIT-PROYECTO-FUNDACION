import { CourseCategory } from "../utils/enums/courseCategory.js";
import type { Entity } from "../utils/types/entity.js";

export interface Course extends Entity {
    name: string;              // nombre del curso
    description: string;       // descripción del curso
    durationMonths: number;    // duración del curso en meses
    schedule: string;          // horario y días del curso (texto libre)
    startDate: Date;           // fecha de inicio del curso
    endDate: Date;             // fecha de finalización del curso
    pricePerMonth: number;     // precio por mes del curso
    category: CourseCategory;  // categoría del curso
    adminId: string;           // ID del administrador que creó el curso
    teacherId?: string;        // ID del docente asignado (opcional)
    maxCapacity: number;       // capacidad máxima de alumnos
    enrolledCount?: number;    // cantidad actual de alumnos inscritos (opcional)
}

// Versión segura para exponer públicamente
export type SecureCourse = Omit<Course, "adminId">; // no se expone el ID del administrador