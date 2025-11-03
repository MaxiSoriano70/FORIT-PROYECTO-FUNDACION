import { Schema, model, Types, Document } from "mongoose";

const collection = "courses";

export interface ICourse extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    durationMonths: number;
    schedule: string;
    startDate: Date;
    endDate: Date;
    pricePerMonth: number;
    categoryId: Types.ObjectId;
    adminId: Types.ObjectId;
    teacherId?: Types.ObjectId | null;
    maxCapacity: number;
    enrolledCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const courseSchema = new Schema<ICourse>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
            validate: {
                validator: (v: string) =>
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]{3,100}$/.test(v),
                message: (props: any) =>
                    `El nombre "${props.value}" no es válido. Debe tener entre 3 y 100 caracteres.`,
            },
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 500,
            validate: {
                validator: (v: string) =>
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¡!¿?"'-]{10,500}$/.test(v),
                message: () => `La descripción debe tener entre 10 y 500 caracteres.`,
            },
        },
        durationMonths: {
            type: Number,
            required: true,
            min: 1,
            max: 60,
            validate: {
                validator: Number.isInteger,
                message: (props: any) =>
                    `${props.value} no es un número entero válido para duración.`,
            },
        },
        schedule: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 100,
            validate: {
                validator: (v: string) =>
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,:-]{5,100}$/.test(v),
                message: (props: any) => `El horario "${props.value}" no es válido.`,
            },
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: (v: Date) => v instanceof Date && !isNaN(v.getTime()),
                message: () => `La fecha de inicio no es válida.`,
            },
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: (v: Date) => v instanceof Date && !isNaN(v.getTime()),
                message: () => `La fecha de finalización no es válida.`,
            },
        },
        pricePerMonth: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: (v: number) => !isNaN(v) && v >= 0,
                message: () => `El precio por mes debe ser un número positivo.`,
            },
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "categories",
            required: true,
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },
        maxCapacity: {
            type: Number,
            required: true,
            min: 1,
            max: 500,
            validate: {
                validator: Number.isInteger,
                message: (props: any) =>
                    `${props.value} no es un número entero válido para capacidad.`,
            },
        },
        enrolledCount: {
            type: Number,
            default: 0,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: (props: any) =>
                    `${props.value} no es un número entero válido para cantidad de inscriptos.`,
            },
        },
    },
    { timestamps: true }
);

const Course = model<ICourse>(collection, courseSchema);

export default Course;
