import { CourseService } from "../../services";

export interface DeleteCourseDeps {
    courseService: CourseService;
}

export async function deleteCourse(id: string, deps: DeleteCourseDeps) {
    return await deps.courseService.deleteById(id);
}
