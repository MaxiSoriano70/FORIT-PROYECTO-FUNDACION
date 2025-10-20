import { Schema, model } from "mongoose";
import { UserRole } from "../../../emuns/userRole.emun.js";

const collection = "users";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        validate: {
            validator: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(v),
            message: props => `El nombre debe tener al menos 2 letras y solo puede contener letras y espacios.`
        }
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        validate: {
            validator: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(v),
            message: props => `El apellido debe tener al menos 2 letras y solo puede contener letras y espacios.`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "El email no tiene un formato válido."
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(v),
            message: props => `La contraseña no cumple con los requisitos de seguridad.`
        }
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 15,
        validate: {
            validator: v => /^\+?[0-9]{8,15}$/.test(v),
            message: props => `El teléfono ${props.value} no es válido.`
        }
    },
    address: {
        type: String,
        required: true,
        minlength: 3,
        validate: {
            validator: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]{3,}$/.test(v),
            message: props => `El domicilio debe tener al menos 3 caracteres y solo puede contener letras, números, espacios, puntos y comas.`
        }
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.STUDENT
    },
    profileImage: {
        type: String,
        default: "https://i.ibb.co/2kR9YQk/default-profile.png",
        validate: {
            validator: v => /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(v),
            message: props => `La URL de la imagen no es válida.`
        }
    }
}, { timestamps: true });

const User = model(collection, userSchema);

export default User;
