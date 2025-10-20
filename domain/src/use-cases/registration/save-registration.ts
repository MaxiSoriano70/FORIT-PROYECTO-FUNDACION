import { CourseService, RegistrationService, UserService } from "../../services";
import type { Registration } from "../../entities/registration";

export interface RegistrationSaveDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
    userService: UserService;
}

export async function getRegistrationSave(
    registration: Registration,
    deps: RegistrationSaveDeps
) {
    const course = await deps.courseService.findById(registration.courseId);
    if (!course) {
        throw new Error(`Curso con id ${registration.courseId} no encontrado`);
    }

    const student = await deps.userService.findById(registration.studentId);
    if (!student) {
        throw new Error(`Estudiante con id ${registration.studentId} no encontrado`);
    }

    const alreadyRegistered = await deps.registrationService.isStudentRegistered(
        registration.courseId,
        registration.studentId
    );

    if (alreadyRegistered) {
        throw new Error(`El estudiante ${student.firstName} ${student.lastName} ya está inscrito en el curso ${course.name}`);
    }

    await deps.registrationService.save(registration);

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
