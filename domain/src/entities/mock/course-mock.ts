import { faker } from "@faker-js/faker";
import type { Course } from "../course.js";
import { CourseCategory } from "../../utils/enums/courseCategory";

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
        id: faker.string.uuid(),
        name: faker.company.buzzPhrase(),
        description: faker.lorem.paragraph(),
        durationMonths,
        schedule: "Lunes a Viernes",
        startDate,
        endDate,
        pricePerMonth: faker.number.int({ min: 100, max: 1000 }),
        category: faker.helpers.arrayElement(Object.values(CourseCategory)),
        adminId: faker.string.uuid(),
        teacherId: faker.string.uuid(),
        ...opts,
    };
}

