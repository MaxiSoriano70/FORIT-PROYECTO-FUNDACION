import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { ICourse } from "../../data/mongo/models/course.model.js";
import { Document, FilterQuery } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function findCourseBy(filter: FilterQuery<ICourse>): Promise<Lean<ICourse> | null> {
    const course = await courseManager.findBy(filter);
    return course;
}
