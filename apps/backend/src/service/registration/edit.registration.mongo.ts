import { registrationManager } from "../../data/mongo/managers/registration/registration.manager.js";
import { userManager } from "../../data/mongo/managers/user/user.manager.js";
import { courseManager } from "../../data/mongo/managers/course/course.manager.js";
import { IRegistration } from "../../data/mongo/models/registration.model.js";
import { UserRole } from "../../utils/enums/userRole.js";
import { RegistrationStatus } from "../../utils/enums/registrationStatus.js";
import { Document, UpdateQuery } from "mongoose";

type Lean<T> = Omit<T, Exclude<keyof Document, "_id">>;

export async function editRegistration(
    id: string,
    data: UpdateQuery<IRegistration>
): Promise<Lean<IRegistration> | null> {
    if (data.studentId) {
        const student = await userManager.findById(data.studentId);
        if (!student) throw new Error(`El usuario con id "${data.studentId}" no existe`);
        if (student.role !== UserRole.STUDENT)
            throw new Error(`El usuario con id "${data.studentId}" no es un STUDENT`);
    }

    if (data.courseId) {
        const course = await courseManager.findById(data.courseId);
        if (!course) throw new Error(`El curso con id "${data.courseId}" no existe`);

        data.totalQuotas = course.durationMonths;
        data.pricePerQuota = course.pricePerMonth;
        data.totalAmount = course.durationMonths * course.pricePerMonth;
    }

    if (data.status && !Object.values(RegistrationStatus).includes(data.status as any)) {
        throw new Error(`El estado "${data.status}" no es válido`);
    }

    const updated = await registrationManager.editOne(id, data);
    return updated;
}
