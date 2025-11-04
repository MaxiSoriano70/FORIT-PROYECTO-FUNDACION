import Registration, { IRegistration } from "../../data/mongo/models/registration.model.js";
import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "@backend/utils/index.js";

export async function saveRegistration(data: Partial<IRegistration>): Promise<IRegistration> {
    if (!data.studentId) throw new Error("Debe proporcionar studentId");
    const student = await userManager.findById(data.studentId);
    if (!student) throw new Error(`El usuario con id "${data.studentId}" no existe`);
    if (student.role !== UserRole.STUDENT) throw new Error(`El usuario con id "${data.studentId}" no es un STUDENT`);

    if (!data.courseId) throw new Error("Debe proporcionar courseId");
    const course = await courseManager.findById(data.courseId);
    if (!course) throw new Error(`El curso con id "${data.courseId}" no existe`);

    const totalQuotas = course.durationMonths;
    const pricePerQuota = course.pricePerMonth;
    const totalAmount = totalQuotas * pricePerQuota;

    const registration = new Registration({
        studentId: student._id,
        courseId: course._id,
        enrollmentDate: new Date(),
        status: RegistrationStatus.ACTIVO,
        courseFinished: false,
        totalQuotas,
        paidQuotas: 0,
        pricePerQuota,
        totalAmount
    });

    await registration.save();

    return registration.toObject() as IRegistration;
}
