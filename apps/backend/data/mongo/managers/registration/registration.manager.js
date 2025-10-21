import Manager from "./manager.mongo.js";
import Registration from "../../models/registration.model.js";

class RegistrationManager extends Manager {
    constructor() {
        super(Registration);
    }

    findByStudentId = async (studentId) => {
        return await this.model.find({ studentId }).lean();
    };

    findByCourseId = async (courseId) => {
        return await this.model.find({ courseId }).lean();
    };

    countActiveByCourseId = async (courseId) => {
        return await this.model.countDocuments({ courseId, status: "ACTIVO" });
    };

    isStudentRegistered = async (courseId, studentId) => {
        const registration = await this.model.findOne({ courseId, studentId }).lean();
        return !!registration;
    };

    markQuotaPaid = async (registrationId, quantity = 1) => {
        const registration = await this.model.findById(registrationId);
        if (!registration) throw new Error("Inscripción no encontrada");

        registration.paidQuotas = Math.min(
            registration.totalQuotas,
            (registration.paidQuotas || 0) + quantity
        );

        await registration.save();
        return registration.toObject();
    };

    finishCourse = async (registrationId) => {
        const registration = await this.model.findById(registrationId);
        if (!registration) throw new Error("Inscripción no encontrada");

        registration.courseFinished = true;
        registration.completionDate = new Date();
        registration.status = "COMPLETADO";

        await registration.save();
        return registration.toObject();
    };

    findActive = async () => {
        return await this.model.find({ status: "ACTIVO" }).lean();
    };

    findIncomplete = async () => {
        return await this.model.find({ courseFinished: false }).lean();
    };
}

const registrationManager = new RegistrationManager();

export { registrationManager };
export default RegistrationManager;
