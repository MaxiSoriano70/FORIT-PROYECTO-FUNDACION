import { RegistrationStatus } from "../utils/enums/registrationStatus";
import { Entity } from "../utils/types/entity";

export interface Registration extends Entity {
    studentId: string;
    // 🔹 ID del alumno que se inscribió al curso.
    // (Hace referencia a un usuario con rol "student")

    courseId: string;
    // 🔹 ID del curso al que se inscribió el alumno.

    enrollmentDate: Date;
    // 🔹 Fecha en la que se realizó la inscripción.

    status: RegistrationStatus;
    // 🔹 Estado actual de la inscripción (ACTIVO, COMPLETADO, ABANDONADO, etc.)

    courseFinished: boolean;
    // 🔹 Indica si el curso ya fue finalizado por el alumno.

    completionDate: Date | undefined;
    // 🔹 Fecha en la que el alumno completó el curso (solo si courseFinished es true).

    totalQuotas: number;
    // 🔹 Cantidad total de cuotas del curso (por ejemplo: 3 cuotas mensuales).

    paidQuotas: number;
    // 🔹 Número de cuotas ya pagadas por el alumno (por ejemplo: 1 significa "1/3").

    pricePerQuota: number;
    // 🔹 Precio de cada cuota (normalmente viene del curso).

    totalAmount: number;
    // 🔹 Monto total del curso (se calcula como totalQuotas * pricePerQuota).

    certificateUrl: string | undefined;
    // 🔹 Enlace al certificado del curso (solo si el alumno lo completó).
}
