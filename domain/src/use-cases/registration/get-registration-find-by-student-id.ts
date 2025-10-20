import { CourseService, RegistrationService, UserService } from "../../services";
import { UserRole } from "../../utils/enums/userRole";

export interface GetRegistrationFindByStudentIdDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
    userService: UserService;
}

export async function getRegistrationFindStudentById(
    id: string,
    deps: GetRegistrationFindByStudentIdDeps
) {
    const { registrationService, userService, courseService } = deps;

    const user = await userService.findById(id);
    if (!user) {
        throw new Error("El usuario no existe");
    }

    if (user.role !== UserRole.STUDENT) {
        throw new Error("El usuario no es un estudiante");
    }

    const registrations = await registrationService.findByStudentId(id);
    if (registrations.length === 0) {
        throw new Error("El alumno no tiene inscripciones registradas");
    }

    const result = await Promise.all(
        registrations.map(async (reg) => {
            const course = await courseService.findById(reg.courseId);
            return {
                ...reg,
                courseName: course?.name ?? "Curso no encontrado",
                studentName: `${user.firstName} ${user.lastName}`,
            };
        })
    );

    return result;
}
