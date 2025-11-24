import { Document, Types } from "mongoose";
import Manager from "../manager.mongo.js";
import Registration, { IRegistration } from "../../models/registration.model.js";
import { RegistrationStatus } from "../../../../utils/enums/registrationStatus.js";
import { userManager } from "../user/user.manager.js";
import { courseManager } from "../course/course.manager.js";

type Lean<T> = Omit<T, keyof Document>;

class RegistrationManager extends Manager<IRegistration> {
    constructor() {
        super(Registration);
    }

    async createRegistration(data: {
        studentId: string;
        courseId: string;
    }): Promise<Lean<IRegistration>> {
        const studentId = new Types.ObjectId(data.studentId);
        const courseId = new Types.ObjectId(data.courseId);

        const student = await userManager.findById(studentId);
        if (!student) throw new Error("El estudiante no existe.");


        const course = await courseManager.findById(courseId);
        if (!course) throw new Error("El curso no existe.");

        const alreadyRegistered = await this.isStudentRegistered(courseId.toString(), studentId.toString());
        if (alreadyRegistered) {
            throw new Error("El estudiante ya está inscripto en este curso.");
        }

        if (course.enrolledCount >= course.maxCapacity) {
            throw new Error("El curso ya está completo.");
        }

        const totalQuotas = course.durationMonths;
        const pricePerQuota = course.pricePerMonth;
        const totalAmount = totalQuotas * pricePerQuota;

        const newRegistration = await this.save({
            studentId,
            courseId,
            enrollmentDate: new Date(),
            status: RegistrationStatus.ACTIVO,
            courseFinished: false,
            totalQuotas,
            paidQuotas: 0,
            pricePerQuota,
            totalAmount,
        } as Partial<IRegistration>);

        await courseManager.editOne(courseId.toString(), {
            enrolledCount: (course.enrolledCount || 0) + 1,
        });

        return newRegistration;
    }

    findByStudentId = async (studentId: string): Promise<Lean<IRegistration>[]> => {
        return (await this.model.find({ studentId }).lean()) as Lean<IRegistration>[];
    };

    findByCourseId = async (courseId: string): Promise<Lean<IRegistration>[]> => {
        return (await this.model.find({ courseId }).lean()) as Lean<IRegistration>[];
    };

    countActiveByCourseId = async (courseId: string): Promise<number> => {
        return await this.model.countDocuments({ courseId, status: RegistrationStatus.ACTIVO });
    };

    isStudentRegistered = async (courseId: string, studentId: string): Promise<boolean> => {
        const registration = await this.model.findOne({ courseId, studentId }).lean();
        return !!registration;
    };

    markQuotaPaid = async (registrationId: string, quantity = 1): Promise<Lean<IRegistration>> => {
        const registration = await this.model.findById(registrationId);
        if (!registration) throw new Error("Inscripción no encontrada");

        registration.paidQuotas = Math.min(
            registration.totalQuotas,
            (registration.paidQuotas || 0) + quantity
        );

        await registration.save();
        return registration.toObject() as Lean<IRegistration>;
    };

    finishCourse = async (registrationId: string): Promise<Lean<IRegistration>> => {
        const registration = await this.model.findById(registrationId);
        if (!registration) throw new Error("Inscripción no encontrada");

        registration.courseFinished = true;
        registration.completionDate = new Date();
        registration.status = RegistrationStatus.COMPLETADO;

        await registration.save();
        return registration.toObject() as Lean<IRegistration>;
    };

    findActive = async (): Promise<Lean<IRegistration>[]> => {
        return (await this.model.find({ status: RegistrationStatus.ACTIVO }).lean()) as Lean<IRegistration>[];
    };

    findIncomplete = async (): Promise<Lean<IRegistration>[]> => {
        return (await this.model.find({ courseFinished: false }).lean()) as Lean<IRegistration>[];
    };

    abandonCourse = async (registrationId: string): Promise<Lean<IRegistration>> => {
        const registration = await this.model.findById(registrationId);
        if (!registration) throw new Error("Inscripción no encontrada");

        registration.status = RegistrationStatus.ABANDONADO;

        await registration.save();
        return registration.toObject() as Lean<IRegistration>;
    };

    activateCourse = async (registrationId: string): Promise<Lean<IRegistration>> => {
        const registration = await this.model.findById(registrationId);
        if (!registration) throw new Error("Inscripción no encontrada");

        registration.status = RegistrationStatus.ACTIVO;

        await registration.save();
        return registration.toObject() as Lean<IRegistration>;
    };

    deleteRegistration = async (registrationId: string): Promise<void> => {
        const registration = await this.model.findById(registrationId);
        if (!registration) throw new Error("Inscripción no encontrada");

        const course = await courseManager.findById(registration.courseId.toString());
        if (!course) throw new Error("Curso no encontrado");

        const today = new Date();

        if (course.startDate && today >= new Date(course.startDate)) {
            throw new Error("No se puede eliminar la inscripción porque el curso ya ha comenzado.");
        }

        await this.model.findByIdAndDelete(registrationId);

        await courseManager.editOne(registration.courseId.toString(), {
            enrolledCount: (course.enrolledCount || 1) - 1
        });
    };


}

const registrationManager = new RegistrationManager();

export { registrationManager, Lean };
export default RegistrationManager;
