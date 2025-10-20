import { CourseService, RegistrationService, UserService } from "../../services";

export interface RegistrationIsStudentRegisteredDeps {
    registrationService: RegistrationService;
    userService: UserService;
    courseService: CourseService;
}

export async function registrationIsStudentRegistered(
    courseId: string,
    studentId: string,
    deps: RegistrationIsStudentRegisteredDeps
) {
    const { registrationService, userService, courseService } = deps;

    const course = await courseService.findById(courseId);
    if (!course) {
        throw new Error("El curso no existe");
    }

    const student = await userService.findById(studentId);
    if (!student) {
        throw new Error("El alumno no existe");
    }

    const isRegistered = await registrationService.isStudentRegistered(courseId, studentId);

    return isRegistered;
}
