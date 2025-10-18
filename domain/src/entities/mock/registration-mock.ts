import { faker } from "@faker-js/faker";
import type { Registration } from "../registration";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";

export function registrationMock(opts?: Partial<Registration>): Registration {
    const totalQuotas = opts?.totalQuotas ?? faker.number.int({ min: 1, max: 12 });
    const pricePerQuota = opts?.pricePerQuota ?? faker.number.int({ min: 100, max: 1000 });
    const totalAmount = totalQuotas * pricePerQuota;
    const paidQuotas = opts?.paidQuotas ?? faker.number.int({ min: 0, max: totalQuotas });

    const courseFinished = opts?.courseFinished ?? false;

    const status: RegistrationStatus =
        courseFinished && paidQuotas === totalQuotas
            ? RegistrationStatus.COMPLETADO
            : RegistrationStatus.ACTIVO;

    return {
        id: opts?.id ?? faker.string.uuid(),
        studentId: opts?.studentId ?? faker.string.uuid(),
        courseId: opts?.courseId ?? faker.string.uuid(),
        enrollmentDate: opts?.enrollmentDate ?? faker.date.past({ years: 1 }),
        status: opts?.status ?? status,
        courseFinished,
        completionDate:
            opts?.completionDate ?? (courseFinished ? faker.date.recent({ days: 30 }) : undefined),
        totalQuotas,
        paidQuotas,
        pricePerQuota,
        totalAmount,
        certificateUrl:
            opts?.certificateUrl ?? (courseFinished ? faker.internet.url() : undefined),
    };
}
