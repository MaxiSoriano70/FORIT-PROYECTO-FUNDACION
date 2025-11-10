import { Schema, model, Document, Types } from "mongoose";
import { InformationStatus } from "../../../utils/enums/informationStatus.js";

const collection = "informations";

export interface IInformation extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courseId: Types.ObjectId;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const InformationSchema = new Schema<IInformation>(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            validate: {
                validator: (v: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(v),
                message: "El nombre debe tener al menos 2 letras y solo puede contener letras y espacios.",
            },
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            validate: {
                validator: (v: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(v),
                message: "El apellido debe tener al menos 2 letras y solo puede contener letras y espacios.",
            },
        },
        email: {
            type: String,
            required: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "El email no tiene un formato válido.",
            ],
        },
        phone: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 15,
            validate: {
                validator: (v: string) => /^\+?[0-9]{8,15}$/.test(v),
                message: (props: any) => `El teléfono ${props.value} no es válido.`,
            },
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "courses",
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(InformationStatus),
            default: InformationStatus.INFORMAR,
        },
    },
    { timestamps: true }
);

InformationSchema.index({ email: 1, courseId: 1 }, { unique: true });

const Information = model<IInformation>(collection, InformationSchema);
export default Information;
