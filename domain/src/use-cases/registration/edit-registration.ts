import { CourseService, RegistrationService, UserService } from "../../services";
import type { Registration } from "../../entities/registration";

export interface EditRegistrationDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
    userService: UserService;
}

export async function registrationEdit(
    id: string,
    data: Partial<Registration>,
    deps: EditRegistrationDeps
) {
    const existingRegistration = await deps.registrationService.findById(id);
    if (!existingRegistration) {
        throw new Error(`Inscripción con id ${id} no encontrada`);
    }

    const courseId = data.courseId ?? existingRegistration.courseId;
    const course = await deps.courseService.findById(courseId);
    if (!course) {
        throw new Error(`Curso con id ${courseId} no encontrado`);
    }

    const studentId = data.studentId ?? existingRegistration.studentId;
    const student = await deps.userService.findById(studentId);
    if (!student) {
        throw new Error(`Estudiante con id ${studentId} no encontrado`);
    }

    const updated = await deps.registrationService.editOne(id, data);

    return {
        ...updated,
        course: { id: course.id, name: course.name },
        student: {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
        },
    };
}
