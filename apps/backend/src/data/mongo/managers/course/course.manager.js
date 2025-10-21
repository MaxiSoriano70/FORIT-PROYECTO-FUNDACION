import Manager from "../manager.mongo.js";
import Course from "../../models/course.model.js";

class CourseManager extends Manager {
    constructor() {
        super(Course);
    }

    findByName = async (name) => {
        return await this.model.findOne({ name }).lean();
    };

    findByCategoryId = async (categoryId) => {
        return await this.model.find({ categoryId }).lean();
    };

    findByTeacherId = async (teacherId) => {
        return await this.model.find({ teacherId }).lean();
    };

    findActiveCourses = async () => {
        const today = new Date();
        return await this.model.find({ endDate: { $gte: today } }).lean();
    };

    findUpcomingCourses = async () => {
        const today = new Date();
        return await this.model.find({ startDate: { $gte: today } }).lean();
    };

    findFullCourses = async () => {
        return await this.model.find({
            $expr: { $gte: ["$enrolledCount", "$maxCapacity"] }
        }).lean();
    };
}

const courseManager = new CourseManager();

export { courseManager };
export default CourseManager;
