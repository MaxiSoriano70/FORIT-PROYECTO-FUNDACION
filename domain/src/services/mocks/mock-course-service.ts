import { Course } from "../../entities";
import { CourseCategory } from "../../utils/enums/courseCategory";
import { CourseService } from "../course-service";


export class MockedCourseService implements CourseService {
    private courses: Course[] = [];

    constructor(courses: Course[] = []) {
        this.courses = courses;
    }

    findAll = async (): Promise<Course[]> => {
        return this.courses;
    };

    findById = async (id: string): Promise<Course | undefined> => {
        return this.courses.find(c => c.id === id);
    };

    findByName = async (name: string): Promise<Course | undefined> => {
        return this.courses.find(c => c.name.toLowerCase() === name.toLowerCase());
    };

    findByCategoryId = async (categoryId: string): Promise<Course[]> => {
        return this.courses.filter(c => c.categoryId === categoryId);
    };

    findByTeacherId = async (teacherId: string): Promise<Course[]> => {
        return this.courses.filter(c => c.teacherId === teacherId);
    };

    findActiveCourses = async (): Promise<Course[]> => {
        const today = new Date();
        return this.courses.filter(c => c.endDate > today);
    };

    findUpcomingCourses = async (): Promise<Course[]> => {
        const today = new Date();
        return this.courses.filter(c => c.startDate > today);
    };

    findFullCourses = async (): Promise<Course[]> => {
        return this.courses.filter(
            c => (c.enrolledCount ?? 0) >= (c.maxCapacity ?? 0)
        );
    };

    editOne = async (id: string, data: Partial<Course>): Promise<Course> => {
        const index = this.courses.findIndex(c => c.id === id);
        if (index === -1) throw new Error(`Curso con id ${id} no encontrado`);
        this.courses[index] = { ...this.courses[index], ...data } as Course;
        return this.courses[index];
    };

    save = async (course: Course): Promise<void> => {
        const exists = this.courses.some(c => c.id === course.id);
        if (exists) throw new Error(`Curso con id ${course.id} ya existe`);
        this.courses.push(course);
    };

    deleteById = async (id: string): Promise<void> => {
        const index = this.courses.findIndex(c => c.id === id);
        if (index === -1) throw new Error(`Curso con id ${id} no encontrado`);
        this.courses.splice(index, 1);
    };
}
