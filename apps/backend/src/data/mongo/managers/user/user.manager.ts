import { Document } from "mongoose";
import Manager from "../manager.mongo.js";
import User, { IUser } from "../../models/user.model.js";
import { UserRole } from "../../../../utils/enums/userRole.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

type Lean<T> = Omit<T, keyof Document>;

class UserManager extends Manager<IUser> {
    constructor() {
        super(User);
    }

    findByFirstName = async (firstName: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ firstName }).lean()) as Lean<IUser> | null;
    };

    findByLastName = async (lastName: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ lastName }).lean()) as Lean<IUser> | null;
    };

    findByEmail = async (email: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ email }).lean()) as Lean<IUser> | null;
    };

    findByFullName = async (firstName: string, lastName: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ firstName, lastName }).lean()) as Lean<IUser> | null;
    };

    changeRole = async (userId: string, newRole: UserRole): Promise<Lean<IUser> | null> => {
        if (!Object.values(UserRole).includes(newRole)) {
            throw new Error(`Rol inválido: ${newRole}`);
        }

        return (await this.model
            .findByIdAndUpdate(userId, { role: newRole }, { new: true })
            .lean()) as Lean<IUser> | null;
    };

    findByRole = async (role: UserRole): Promise<Lean<IUser>[]> => {
        return (await this.model.find({ role }).lean()) as Lean<IUser>[];
    };

    createUser = async ({
        firstName,
        lastName,
        email,
        phone,
        address,
    }: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address?: string;
    }): Promise<Lean<IUser>> => {
        const rawPassword = `${lastName}_1234`;

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newUser = await this.model.create({
            firstName,
            lastName,
            email,
            phone,
            address,
            password: hashedPassword,
            role: UserRole.STUDENT,
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Tu cuenta ha sido creada",
            html: `
        <p>Hola ${firstName},</p>
        <p>Tu cuenta ha sido creada con éxito.</p>
        <p><b>Usuario:</b> ${email}</p>
        <p><b>Contraseña:</b> ${rawPassword}</p>
        <p>Por favor, cambia tu contraseña al ingresar por primera vez.</p>`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email enviado:", info.response);
        } catch (err) {
            console.error("Error enviando email:", err);
        }

        return newUser.toObject() as Lean<IUser>;
    };
}

const userManager = new UserManager();

export { userManager };
export default UserManager;
