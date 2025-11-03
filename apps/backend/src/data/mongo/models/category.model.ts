import { Schema, model, Document, Types } from "mongoose";

const collection = "categories";

export interface ICategory extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
            validate: {
                validator: (v: string) =>
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]{3,50}$/.test(v),
                message: (props: { value: string }) =>
                    `El nombre "${props.value}" no es válido. Debe tener entre 3 y 50 caracteres y solo puede contener letras, números, espacios, puntos, comas o guiones.`,
            },
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 300,
            validate: {
                validator: (v: string) =>
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¡!¿?"'-]{10,300}$/.test(v),
                message: () =>
                    `La descripción debe tener entre 10 y 300 caracteres y solo puede contener texto válido.`,
            },
        },
    },
    { timestamps: true }
);

const Category = model<ICategory>(collection, categorySchema);
export default Category;
