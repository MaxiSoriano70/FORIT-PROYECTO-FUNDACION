import { Registration } from "../../entities";
import { RegistrationService } from "../registration-service";


export class MockedRegistrationService implements RegistrationService {
    private registrations: Registration[] = [];

    constructor(registrations: Registration[] = []) {
        this.registrations = registrations;
    }

    findAll = async (): Promise<Registration[]> => this.registrations;

    findById = async (id: string): Promise<Registration | undefined> =>
        this.registrations.find(r => r.id === id);

    save = async (registration: Registration): Promise<void> => {
        if (this.registrations.some(r => r.id === registration.id)) {
            throw new Error(`Registration con id ${registration.id} ya existe`);
        }
        this.registrations.push(registration);
    };

    editOne = async (id: string, data: Partial<Registration>): Promise<Registration> => {
        const index = this.registrations.findIndex(r => r.id === id);
        if (index === -1) throw new Error(`Registration con id ${id} no encontrado`);
        const updated = { ...this.registrations[index], ...data } as Registration;
        this.registrations[index] = updated;
        return updated;
    };


    deleteById = async (id: string): Promise<void> => {
        const index = this.registrations.findIndex(r => r.id === id);
        if (index === -1) throw new Error(`Registration con id ${id} no encontrado`);
        this.registrations.splice(index, 1);
    };

    // 🔹 Métodos propios del RegistrationService
    findByStudentId = async (studentId: string): Promise<Registration[]> =>
        this.registrations.filter(r => r.studentId === studentId);

    findByCourseId = async (courseId: string): Promise<Registration[]> =>
        this.registrations.filter(r => r.courseId === courseId);

    countActiveByCourseId = async (courseId: string): Promise<number> =>
        this.registrations.filter(r => r.courseId === courseId && r.status === "ACTIVO").length;

    isStudentRegistered = async (courseId: string, studentId: string): Promise<boolean> =>
        this.registrations.some(r => r.courseId === courseId && r.studentId === studentId);

    markQuotaPaid = async (registrationId: string, quantity = 1): Promise<Registration> => {
        const registration = await this.findById(registrationId);
        if (!registration) throw new Error(`Registration con id ${registrationId} no encontrado`);
        registration.paidQuotas += quantity;
        if (registration.paidQuotas >= registration.totalQuotas) {
            registration.status = "COMPLETADO";
        }
        return registration;
    };

    finishCourse = async (registrationId: string): Promise<Registration> => {
        const registration = await this.findById(registrationId);
        if (!registration) throw new Error(`Registration con id ${registrationId} no encontrado`);
        registration.courseFinished = true;
        registration.status = "COMPLETADO";
        registration.completionDate = new Date();
        return registration;
    };

    findActive = async (): Promise<Registration[]> =>
        this.registrations.filter(r => r.status === "ACTIVO");

    findIncomplete = async (): Promise<Registration[]> =>
        this.registrations.filter(r => r.paidQuotas < r.totalQuotas);
}
