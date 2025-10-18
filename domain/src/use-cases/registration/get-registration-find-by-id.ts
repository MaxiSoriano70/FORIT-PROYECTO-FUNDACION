import { CourseService, RegistrationService, UserService } from "../../services";

export interface GetRegistrationFindByIdDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
    userService: UserService;
}

export async function getRegistrationFindById(
    id: string,
    deps: GetRegistrationFindByIdDeps
) {
    const registration = await deps.registrationService.findById(id);
    if (!registration) {
        throw new Error(`Inscripción con id ${id} no encontrada`);
    }

    const course = await deps.courseService.findById(registration.courseId);
    if (!course) {
        throw new Error(`Curso con id ${registration.courseId} no encontrado para la inscripción ${registration.id}`);
    }

    const student = await deps.userService.findById(registration.studentId);
    if (!student) {
        throw new Error(`Estudiante con id ${registration.studentId} no encontrado para la inscripción ${registration.id}`);
    }

    return {
        ...registration,
        course: { id: course.id, name: course.name },
        student: {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
        },
    };
}
