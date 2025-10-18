import { faker } from "@faker-js/faker";
import type { Course } from "../course.js";

function generateCourseDates() {
    const startDate = faker.date.future({ years: 1 });
    const durationMonths = faker.number.int({ min: 1, max: 12 });
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return { startDate, endDate, durationMonths };
}

export function courseMock(opts?: Partial<Course>): Course {
    const { startDate, endDate, durationMonths } = generateCourseDates();

    return {
        ...opts,
        id: opts?.id ?? faker.string.uuid(),
        name: opts?.name ?? faker.company.buzzPhrase(),
        description: opts?.description ?? faker.lorem.paragraph(),
        durationMonths: opts?.durationMonths ?? durationMonths,
        schedule:
            opts?.schedule ??
            faker.helpers.arrayElement([
                "Lunes a Viernes - 18:00 a 20:00",
                "Sábados - 09:00 a 13:00",
                "Martes y Jueves - 19:00 a 21:00",
            ]),
        startDate: opts?.startDate ?? startDate,
        endDate: opts?.endDate ?? endDate,
        pricePerMonth: opts?.pricePerMonth ?? faker.number.int({ min: 100, max: 1000 }),
        categoryId: opts?.categoryId ?? faker.string.uuid(),
        adminId: opts?.adminId ?? faker.string.uuid(),
        teacherId: opts?.teacherId ?? faker.string.uuid(),
        maxCapacity: opts?.maxCapacity ?? faker.number.int({ min: 10, max: 50 }),
        enrolledCount: opts?.enrolledCount ?? faker.number.int({ min: 0, max: 50 }),
    };
}
