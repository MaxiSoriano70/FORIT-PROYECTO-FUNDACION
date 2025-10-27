import { Document } from "mongoose";
import Manager from "../manager.mongo.js";
import Course, { ICourse } from "../../models/course.model.js";

type Lean<T> = Omit<T, keyof Document>;

class CourseManager extends Manager<ICourse> {
    constructor() {
        super(Course);
    }

    findByName = async (name: string): Promise<Lean<ICourse> | null> => {
        return (await this.model.findOne({ name }).lean()) as Lean<ICourse> | null;
    };

    findByCategoryId = async (categoryId: string): Promise<Lean<ICourse>[]> => {
        return (await this.model.find({ categoryId }).lean()) as Lean<ICourse>[];
    };

    findByTeacherId = async (teacherId: string): Promise<Lean<ICourse>[]> => {
        return (await this.model.find({ teacherId }).lean()) as Lean<ICourse>[];
    };

    findActiveCourses = async (): Promise<Lean<ICourse>[]> => {
        const today = new Date();
        return (await this.model.find({ endDate: { $gte: today } }).lean()) as Lean<ICourse>[];
    };

    findUpcomingCourses = async (): Promise<Lean<ICourse>[]> => {
        const today = new Date();
        return (await this.model.find({ startDate: { $gte: today } }).lean()) as Lean<ICourse>[];
    };

    findFullCourses = async (): Promise<Lean<ICourse>[]> => {
        return (await this.model.find({
            $expr: { $gte: ["$enrolledCount", "$maxCapacity"] }
        }).lean()) as Lean<ICourse>[];
    };
}

const courseManager = new CourseManager();

export { courseManager };
export default CourseManager;
