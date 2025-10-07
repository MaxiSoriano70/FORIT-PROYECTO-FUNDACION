import { Course } from "../entities";
import { Service } from "../utils/types/service";

export interface UserService extends Service<Course>{
    findByName: (name: string) => Promise<Course | undefined>;
}