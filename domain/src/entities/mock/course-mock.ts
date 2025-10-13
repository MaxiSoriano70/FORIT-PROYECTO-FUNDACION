import { faker } from "@faker-js/faker";
import type { Course } from "../course.js";
import { CourseCategory } from "../../utils/enums/courseCategory.js";

function generateCourseDates() {
    const startDate = faker.date.future({ years: 1 });
    const durationMonths = faker.number.int({ min: 1, max: 12 });
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return { startDate, endDate, durationMonths };
}

export function courseMock(opts?: Partial<Course>): Course {
    const { startDate, endDate, durationMonths } = generateCourseDates();

    const base: Course = {
        id: faker.string.uuid(),
        name: faker.company.buzzPhrase(),
        description: faker.lorem.paragraph(),
        durationMonths,
        schedule: faker.helpers.arrayElement([
            "Lunes a Viernes - 18:00 a 20:00",
            "Sábados - 09:00 a 13:00",
            "Martes y Jueves - 19:00 a 21:00",
        ]),
        startDate,
        endDate,
        pricePerMonth: faker.number.int({ min: 100, max: 1000 }),
        category: faker.helpers.arrayElement(Object.values(CourseCategory)),
        adminId: faker.string.uuid(),
        maxCapacity: faker.number.int({ min: 10, max: 50 }),
        enrolledCount: faker.number.int({ min: 0, max: 50 }),
        ...opts,
    };

    if (faker.datatype.boolean()) {
        base.teacherId = faker.string.uuid();
    }

    return base;
}