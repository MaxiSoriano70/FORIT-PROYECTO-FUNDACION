import { RegistrationService, CourseService, UserService } from "../../services";

export interface UpdateRegistrationQuotaPaidDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
    userService: UserService;
}

export async function updateRegistrationQuotaPaid(
    registrationId: string,
    quantity: number = 1,
    deps: UpdateRegistrationQuotaPaidDeps
) {
    const { registrationService, courseService, userService } = deps;

    const updatedRegistration = await registrationService.markQuotaPaid(registrationId, quantity);

    const course = await courseService.findById(updatedRegistration.courseId);
    if (!course) throw new Error(`Curso con id ${updatedRegistration.courseId} no encontrado`);

    const student = await userService.findById(updatedRegistration.studentId);
    if (!student) throw new Error(`Estudiante con id ${updatedRegistration.studentId} no encontrado`);

    return {
        ...updatedRegistration,
        course: { id: course.id, name: course.name },
        student: { id: student.id, firstName: student.firstName, lastName: student.lastName },
    };
}
