import { InformationStatus } from "../enums/informationStatus";

export interface IInformation {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courseId: string;
    status: InformationStatus;
    createdAt?: Date;
    updatedAt?: Date;
}