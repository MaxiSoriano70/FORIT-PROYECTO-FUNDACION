import { RegistrationStatus } from "../utils/enums/registrationStatus";
import { Entity } from "../utils/types/entity";

export interface Registration extends Entity {
    studentId: string;
    courseId: string;
    enrollmentDate: Date;
    status: RegistrationStatus;
    completionDate?: Date;
    totalFees?: number;
    paidFees?: number;
    certificateUrl?: string;
}