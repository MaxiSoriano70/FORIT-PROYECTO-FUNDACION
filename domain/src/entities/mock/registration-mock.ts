import { faker } from "@faker-js/faker";
import type { Registration } from "../registration";
import type { Course } from "../course";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";

/**
 * Genera un mock de inscripción (Registration) para un curso dado.
 * Simula cuotas y estado de la inscripción.
 */
export function registrationMock(course: Course, opts?: Partial<Registration>): Registration {
    const totalQuotas = course.durationMonths;
    const pricePerQuota = course.pricePerMonth;
    const totalAmount = totalQuotas * pricePerQuota;
    const paidQuotas = faker.number.int({ min: 0, max: totalQuotas });

    const courseFinished = opts?.courseFinished ?? false;

    const status: RegistrationStatus =
        courseFinished && paidQuotas === totalQuotas
            ? RegistrationStatus.COMPLETADO
            : RegistrationStatus.ACTIVO;

    return {
        ...opts,
        id: opts?.id ?? faker.string.uuid(),
        studentId: opts?.studentId ?? faker.string.uuid(),
        courseId: opts?.courseId ?? course.id,
        enrollmentDate: opts?.enrollmentDate ?? faker.date.past({ years: 1 }),
        status: opts?.status ?? status,
        courseFinished,
        completionDate:
            opts?.completionDate ?? (courseFinished ? faker.date.recent({ days: 30 }) : undefined),
        totalQuotas: opts?.totalQuotas ?? totalQuotas,
        paidQuotas: opts?.paidQuotas ?? paidQuotas,
        pricePerQuota: opts?.pricePerQuota ?? pricePerQuota,
        totalAmount: opts?.totalAmount ?? totalAmount,
        certificateUrl:
            opts?.certificateUrl ?? (courseFinished ? faker.internet.url() : undefined),
    };
}
