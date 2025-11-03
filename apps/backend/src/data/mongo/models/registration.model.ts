import { Schema, model, Types, Document } from "mongoose";
import { RegistrationStatus } from "../../../utils/enums/registrationStatus.js";

const collection = "registrations";

export interface IRegistration extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
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

const registrationSchema = new Schema<IRegistration>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "courses",
            required: true,
        },
        enrollmentDate: {
            type: Date,
            required: true,
            default: Date.now,
            validate: {
                validator: (v: Date) => v instanceof Date && !isNaN(v.getTime()),
                message: () => `La fecha de inscripción no es válida.`,
            },
        },
        status: {
            type: String,
            enum: Object.values(RegistrationStatus),
            required: true,
            default: RegistrationStatus.ACTIVO,
        },
        courseFinished: {
            type: Boolean,
            required: true,
            default: false,
        },
        completionDate: {
            type: Date,
            validate: {
                validator: (v?: Date) =>
                    v === undefined || (v instanceof Date && !isNaN(v.getTime())),
                message: () => `La fecha de finalización no es válida.`,
            },
        },
        totalQuotas: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: (props: any) =>
                    `${props.value} no es un número entero válido para total de cuotas.`,
            },
        },
        paidQuotas: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: (props: any) =>
                    `${props.value} no es un número entero válido para cuotas pagadas.`,
            },
        },
        pricePerQuota: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: (v: number) => !isNaN(v) && v >= 0,
                message: () => `El precio por cuota debe ser un número positivo.`,
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: (v: number) => !isNaN(v) && v >= 0,
                message: () => `El monto total debe ser un número positivo.`,
            },
        },
        certificateUrl: {
            type: String,
            validate: {
                validator: (v?: string) =>
                    v === undefined ||
                    /^https?:\/\/.*\.(jpg|jpeg|png|pdf|webp)$/i.test(v),
                message: () => `La URL del certificado no es válida.`,
            },
        },
    },
    { timestamps: true }
);

const Registration = model<IRegistration>(collection, registrationSchema);

export default Registration;
