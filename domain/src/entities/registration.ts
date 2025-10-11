import { RegistrationStatus } from "../utils/enums/registrationStatus";
import { Entity } from "../utils/types/entity";

export interface Registration extends Entity {
    studentId: string;              // ID del estudiante inscrito
    courseId: string;               // ID del curso
    enrollmentDate: Date;           // Fecha en la que se realizó la inscripción
    status: RegistrationStatus;     // Estado actual (activo, completado, abandonado, etc.)
    courseFinished: boolean;        // Indica si el curso ya fue finalizado
    completionDate: Date | undefined;// Fecha en que finalizó el curso (si aplica)

    totalQuotas: number;            // Cantidad total de cuotas (ej: 3)
    paidQuotas: number;             // Cuotas ya abonadas (ej: 1 → "1/3")

    pricePerQuota: number;          // Monto de cada cuota (se puede tomar del curso)
    totalAmount: number;            // Monto total del curso (totalQuotas * pricePerQuota)
    amountPaid: number | undefined;            // Monto total abonado (paidQuotas * pricePerQuota)

    certificateUrl: string | undefined;        // Enlace al certificado (si lo obtuvo)
}
