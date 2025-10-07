import { RegistrationStatus } from "../utils/enums/registrationStatus.js";
import type { Entity } from "../utils/types/entity.js";

export interface Registration extends Entity{
    studentId: string;
    courseId: string;
    enrollmentDate: Date;
    status: RegistrationStatus;
    completionDate?: Date;
}