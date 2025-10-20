import { CourseService, RegistrationService, UserService } from "../../services";
import { RegistrationStatus } from "../../utils/enums/registrationStatus";

export interface GetRegistrationCountActiveByCourseIdDeps {
    registrationService: RegistrationService;
    courseService: CourseService;
    userService: UserService;
}

export async function getRegistrationCountActiveByCourseId(
    id: string,
    deps: GetRegistrationCountActiveByCourseIdDeps
) {
    const { registrationService, courseService, userService } = deps;

    const course = await courseService.findById(id);
    if (!course) {
        throw new Error("El curso no existe");
    }

    const activeCount = await registrationService.countActiveByCourseId(id);

    if (activeCount === 0) {
        throw new Error("El curso no tiene alumnos activos");
    }

    const allRegistrations = await registrationService.findByCourseId(id);
    const activeRegistrations = allRegistrations.filter(
        (r) => r.status === RegistrationStatus.ACTIVO
    );

    const students = await Promise.all(
        activeRegistrations.map(async (reg) => {
            const student = await userService.findById(reg.studentId);
            if (!student) {
                throw new Error(
                    `Estudiante con id ${reg.studentId} no encontrado en el curso ${course.name}`
                );
            }
            return {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
            };
        })
    );

    return {
        courseId: course.id,
        courseName: course.name,
        studentCount: activeCount,
        students,
    };
}
