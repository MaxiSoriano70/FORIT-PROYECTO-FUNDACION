import { faker } from "@faker-js/faker";
import type { Registration } from "../registration";
import type { Course } from "../course";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";

export function registrationMock(course: Course, opts?: Partial<Registration>): Registration {
    const totalFees = course.durationMonths * course.pricePerMonth;

    const paidQuotas = faker.number.int({ min: 0, max: course.durationMonths });
    const paidFees = paidQuotas * course.pricePerMonth;

    const finishedCourse = faker.datatype.boolean();

    let status: RegistrationStatus =
        paidQuotas === course.durationMonths && finishedCourse
            ? RegistrationStatus.COMPLETADO
            : RegistrationStatus.ACTIVO;

    return {
        id: faker.string.uuid(),
        studentId: faker.string.uuid(),
        courseId: course.id,
        enrollmentDate: faker.date.past({ years: 1 }),
        status,
        totalFees,
        paidFees,
        completionDate:
            status === RegistrationStatus.COMPLETADO ? new Date() : undefined,
        certificateUrl:
            status === RegistrationStatus.COMPLETADO ? faker.internet.url() : undefined,
        paidQuotas,
        totalQuotas: course.durationMonths,
        ...opts,
    };
}
