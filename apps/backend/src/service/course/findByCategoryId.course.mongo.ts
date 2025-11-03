import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { ICourse } from "../../data/mongo/models/course.model.js";
import { Document } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

export async function findByCategoryId(categoryId: string): Promise<Lean<ICourse>[]> {
    const courses = await courseManager.findByCategoryId(categoryId);
    return courses;
}
