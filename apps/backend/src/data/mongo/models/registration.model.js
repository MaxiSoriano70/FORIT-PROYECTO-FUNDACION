import { Schema, model, Types } from "mongoose";
import { RegistrationStatus } from "../../../enums/registrationStatus.enum.js";

const collection = "registrations";

const registrationSchema = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: "users",
        required: true
    },
    courseId: {
        type: Types.ObjectId,
        ref: "courses",
        required: true
    },
    enrollmentDate: {
        type: Date,
        required: true,
        default: Date.now,
        validate: {
            validator: v => v instanceof Date && !isNaN(v),
            message: props => `La fecha de inscripción no es válida.`
        }
    },
    status: {
        type: String,
        enum: Object.values(RegistrationStatus),
        required: true,
        default: RegistrationStatus.ACTIVE
    },
    courseFinished: {
        type: Boolean,
        required: true,
        default: false
    },
    completionDate: {
        type: Date,
        validate: {
            validator: v => v === undefined || (v instanceof Date && !isNaN(v)),
            message: props => `La fecha de finalización no es válida.`
        }
    },
    totalQuotas: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} no es un número entero válido para total de cuotas.`
        }
    },
    paidQuotas: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} no es un número entero válido para cuotas pagadas.`
        }
    },
    pricePerQuota: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: v => !isNaN(v) && v >= 0,
            message: props => `El precio por cuota debe ser un número positivo.`
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: v => !isNaN(v) && v >= 0,
            message: props => `El monto total debe ser un número positivo.`
        }
    },
    certificateUrl: {
        type: String,
        validate: {
            validator: v => v === undefined || /^https?:\/\/.*\.(jpg|jpeg|png|pdf|webp)$/i.test(v),
            message: props => `La URL del certificado no es válida.`
        }
    }
}, { timestamps: true });

const Registration = model(collection, registrationSchema);

export default Registration;
