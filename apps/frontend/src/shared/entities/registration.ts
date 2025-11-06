import { RegistrationStatus } from "../enums/registrationStatus";

export interface Registration {
    _id: string;
    studentId: string;
    courseId: string;
    enrollmentDate: Date;
    status: RegistrationStatus;
    courseFinished: boolean;
    completionDate?: Date;
    totalQuotas: number;
    paidQuotas: number;
    pricePerQuota: number;
    totalAmount: number;
    certificateUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
