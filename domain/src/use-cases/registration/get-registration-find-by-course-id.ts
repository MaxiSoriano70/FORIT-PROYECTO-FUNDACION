import { CourseService, RegistrationService } from "../../services";

export interface GetRegistrationFindByCourseIdDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
}

export async function getRegistrationFindCourseById(
    id: string,
    deps: GetRegistrationFindByCourseIdDeps
) {
    const { registrationService, courseService } = deps;

    const course = await courseService.findById(id);
    if (!course) {
        throw new Error("El curso no existe");
    }

    const registrations = await registrationService.findByCourseId(id);

    const count = registrations.length;

    return {
        courseId: course.id,
        courseName: course.name,
        studentCount: count,
    };
}
