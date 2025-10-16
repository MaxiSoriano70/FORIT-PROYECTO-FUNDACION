import { Registration } from "../entities";
import { Service } from "../utils/types/service";

export interface RegistrationService extends Service<Registration> {
    // 1️⃣ Buscar todas las inscripciones de un alumno
    findByStudentId(studentId: string): Promise<Registration[]>;

    // 2️⃣ Buscar todas las inscripciones de un curso
    findByCourseId(courseId: string): Promise<Registration[]>;

    // 3️⃣ Contar alumnos activos en un curso
    countActiveByCourseId(courseId: string): Promise<number>;

    // 4️⃣ Verificar si un alumno ya está inscrito en un curso
    isStudentRegistered(courseId: string, studentId: string): Promise<boolean>;

    // 5️⃣ Marcar cuota(s) como pagadas
    markQuotaPaid(registrationId: string, quantity?: number): Promise<Registration>;

    // 6️⃣ Finalizar curso para un alumno
    finishCourse(registrationId: string): Promise<Registration>;

    // 7️⃣ Buscar inscripciones activas
    findActive(): Promise<Registration[]>;
    // 🔹 Alternativamente, inscripciones incompletas
    findIncomplete(): Promise<Registration[]>;
}
