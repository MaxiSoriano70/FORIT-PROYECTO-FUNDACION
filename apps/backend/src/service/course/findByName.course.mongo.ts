import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { ICourse } from "../../data/mongo/models/course.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function findCourseByName(name: string): Promise<Lean<ICourse> | null> {
    const course = await courseManager.findByName(name);
    return course;
}
