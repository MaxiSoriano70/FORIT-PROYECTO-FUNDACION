import { Document } from "mongoose";
import Manager from "../manager.mongo.js";
import Registration, { IRegistration } from "../../models/registration.model.js";
import { RegistrationStatus } from "../../../../utils/enums/registrationStatus.js";

type Lean<T> = Omit<T, keyof Document>;

class RegistrationManager extends Manager<IRegistration> {
    constructor() {
        super(Registration);
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
}

const registrationManager = new RegistrationManager();

export { registrationManager };
export default RegistrationManager;
