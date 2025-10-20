import { Schema, model, Types } from "mongoose";

const collection = "courses";

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
        validate: {
            validator: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]{3,100}$/.test(v),
            message: props => `El nombre "${props.value}" no es válido. Debe tener entre 3 y 100 caracteres.`
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500,
        validate: {
            validator: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¡!¿?"'-]{10,500}$/.test(v),
            message: props => `La descripción debe tener entre 10 y 500 caracteres.`
        }
    },
    durationMonths: {
        type: Number,
        required: true,
        min: 1,
        max: 60,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} no es un número entero válido para duración.`
        }
    },
    schedule: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        validate: {
            validator: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,:-]{5,100}$/.test(v),
            message: props => `El horario "${props.value}" no es válido.`
        }
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: v => v instanceof Date && !isNaN(v),
            message: props => `La fecha de inicio no es válida.`
        }
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: v => v instanceof Date && !isNaN(v),
            message: props => `La fecha de finalización no es válida.`
        }
    },
    pricePerMonth: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: v => !isNaN(v) && v >= 0,
            message: props => `El precio por mes debe ser un número positivo.`
        }
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "categories",
        required: true
    },
    adminId: {
        type: Types.ObjectId,
        ref: "users",
        required: true
    },
    teacherId: {
        type: Types.ObjectId,
        ref: "users",
        default: null
    },
    maxCapacity: {
        type: Number,
        required: true,
        min: 1,
        max: 500,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} no es un número entero válido para capacidad.`
        }
    },
    enrolledCount: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} no es un número entero válido para cantidad de inscriptos.`
        }
    }
}, { timestamps: true });

const Course = model(collection, courseSchema);

export default Course;
