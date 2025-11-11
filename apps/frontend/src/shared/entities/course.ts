export interface Course {
    _id?: string;
    name: string;
    description: string;
    durationMonths: number;
    schedule: string;
    startDate: Date;
    endDate: Date;
    pricePerMonth: number;
    categoryId: string;
    adminId: string;
    teacherId?: string | null;
    maxCapacity: number;
    enrolledCount: number;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
