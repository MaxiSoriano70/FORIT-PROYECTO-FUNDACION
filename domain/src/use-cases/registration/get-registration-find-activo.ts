import { CourseService, RegistrationService, UserService } from "../../services";

export interface GetRegistrationFindActiveDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
    userService: UserService;
}

export async function getRegistrationFindActive(deps: GetRegistrationFindActiveDeps) {
    const registrations = await deps.registrationService.findActive();

    const result = await Promise.all(
        registrations.map(async (registration) => {
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
                course: {
                    id: course.id,
                    name: course.name,
                },
                student: {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                },
            };
        })
    );

    return result;
}
