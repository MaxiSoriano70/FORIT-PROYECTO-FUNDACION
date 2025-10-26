import { Schema, model, Document } from "mongoose";
import { UserRole } from "../../../utils/enums/userRole.js";

const collection = "users";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: UserRole;
    profileImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            validate: {
                validator: (v: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(v),
                message: () =>
                    `El nombre debe tener al menos 2 letras y solo puede contener letras y espacios.`,
            },
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            validate: {
                validator: (v: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(v),
                message: () =>
                    `El apellido debe tener al menos 2 letras y solo puede contener letras y espacios.`,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "El email no tiene un formato válido.",
            ],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            validate: {
                validator: (v: string) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(v),
                message: () =>
                    `La contraseña no cumple con los requisitos de seguridad.`,
            },
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
        address: {
            type: String,
            required: true,
            minlength: 3,
            validate: {
                validator: (v: string) =>
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]{3,}$/.test(v),
                message: () =>
                    `El domicilio debe tener al menos 3 caracteres y solo puede contener letras, números, espacios, puntos y comas.`,
            },
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
        },
        profileImage: {
            type: String,
            default: "https://i.ibb.co/2kR9YQk/default-profile.png",
            validate: {
                validator: (v: string) =>
                    /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(v),
                message: () => `La URL de la imagen no es válida.`,
            },
        },
    },
    { timestamps: true }
);

const User = model<IUser>(collection, userSchema);

export default User;
