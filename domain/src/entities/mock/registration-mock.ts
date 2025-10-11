import { faker } from "@faker-js/faker";
import type { Registration } from "../registration";
import type { Course } from "../course";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";


export function registrationMock(course: Course, opts?: Partial<Registration>): Registration {
    const totalQuotas = course.durationMonths;      // cantidad de meses del curso
    const pricePerQuota = course.pricePerMonth;     // precio de cada cuota
    const totalAmount = totalQuotas * pricePerQuota;

    const paidQuotas = faker.number.int({ min: 0, max: totalQuotas }); // cuotas ya pagadas
    const amountPaid = paidQuotas * pricePerQuota;                     // monto abonado

    const courseFinished = faker.datatype.boolean();                   // indica si el curso terminó
    const status: RegistrationStatus =
        courseFinished && paidQuotas === totalQuotas
            ? RegistrationStatus.COMPLETADO
            : RegistrationStatus.ACTIVO;

    return {
        id: faker.string.uuid(),
        studentId: faker.string.uuid(),
        courseId: course.id,
        enrollmentDate: faker.date.past({ years: 1 }),    // fecha de inscripción
        status,
        courseFinished,
        completionDate: courseFinished ? new Date() : undefined,  // fecha de finalización si terminó
        totalQuotas,
        paidQuotas,
        pricePerQuota,
        totalAmount,
        amountPaid,
        certificateUrl: courseFinished ? faker.internet.url() : undefined,
        ...opts,
    };
}
