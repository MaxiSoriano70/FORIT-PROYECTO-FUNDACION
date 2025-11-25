import { Document, Types } from "mongoose";
import Manager from "../manager.mongo.js";
import Information, { IInformation } from "../../models/information.model.js";
import { userManager } from "../user/user.manager.js";
import { courseManager } from "../course/course.manager.js";
import { InformationStatus } from "../../../../utils/enums/informationStatus.js";
import { UserRole } from "../../../../utils/enums/userRole.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

type Lean<T> = Omit<T, keyof Document>;

class InformationManager extends Manager<IInformation> {
    constructor() {
        super(Information);
    }

    async create(
        data: Partial<Omit<IInformation, "_id" | "courseId">> & { courseId: string | Types.ObjectId }
    ): Promise<Lean<IInformation>> {
        const courseObjectId = new Types.ObjectId(data.courseId);

        const course = await courseManager.findById(courseObjectId);
        if (!course) throw new Error("El curso especificado no existe.");

        const existingUser = await userManager.findByEmail(data.email!);

        const existingInfo = await this.findBy({
            email: data.email,
            courseId: courseObjectId,
        });

        if (existingInfo) {
            const status = existingUser
                ? InformationStatus.USUARIOAINFORMAR
                : InformationStatus.INFORMAR;

            const updatedInfo = await this.editOne(existingInfo._id.toString(), {
                ...data,
                updatedAt: new Date(),
                status,
            });

            return updatedInfo!;
        }

        const status = existingUser
            ? InformationStatus.USUARIOAINFORMAR
            : InformationStatus.INFORMAR;

        const newInfo = await this.save({
            ...data,
            courseId: courseObjectId,
            status,
        });

        return newInfo;
    }

    async convertToUser(informationId: string) {
        const info = await this.findById(informationId);
        if (!info) throw new Error("No se encontró la información especificada.");

        if (!info.courseId) throw new Error("La solicitud no tiene asociado un curso válido.");

        const course = await courseManager.findById(info.courseId.toString());
        if (!course) throw new Error("El curso asociado ya no existe.");

        const existingUser = await userManager.findByEmail(info.email);
        if (existingUser) throw new Error("Ya existe un usuario con ese email.");

        const lastName = info.lastName?.trim() || "User";
        const normalizedLastName = lastName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const formattedLastName = normalizedLastName.charAt(0).toUpperCase() + normalizedLastName.slice(1).toLowerCase();

        const rawPassword = `${formattedLastName}_1234`;
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newUser = await userManager.save({
            firstName: info.firstName,
            lastName: info.lastName,
            email: info.email,
            phone: info.phone,
            address: "No especificada",
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
            to: info.email,
            subject: "Tu cuenta ha sido creada",
            html: `
            <p>Hola ${info.firstName},</p>
            <p>Tu cuenta ha sido creada con éxito.</p>
            <p><b>Usuario:</b> ${info.email}</p>
            <p><b>Contraseña:</b> ${rawPassword}</p>
            <p>Por favor, cambia tu contraseña al ingresar por primera vez.</p>`,
        };

        try {
            const emailInfo = await transporter.sendMail(mailOptions);
            console.log("Email enviado:", emailInfo.response);
        } catch (err) {
            console.error("Error enviando email:", err);
        }

        const updatedInfo = await this.editOne(informationId, {
            status: InformationStatus.INFORMADO,
        });

        return { user: newUser, info: updatedInfo };
    }

}

const informationManager = new InformationManager();
export { informationManager };
export default InformationManager;
