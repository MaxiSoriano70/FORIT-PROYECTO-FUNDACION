import { Document, Types } from "mongoose";
import Manager from "../manager.mongo.js";
import Information, { IInformation } from "../../models/information.model.js";
import { userManager } from "../user/user.manager.js";
import { courseManager } from "../course/course.manager.js";
import { InformationStatus } from "../../../../utils/enums/informationStatus.js";
import { UserRole } from "../../../../utils/enums/userRole.js";

type Lean<T> = Omit<T, keyof Document>;

class InformationManager extends Manager<IInformation> {
    constructor() {
        super(Information);
    }
    /**
     * Crea o actualiza una solicitud de información según el email y curso.
     */
    async create(
        data: Partial<IInformation> & { courseId: string }
    ): Promise<Lean<IInformation>> {
        // 1️⃣ Verificar existencia del curso
        const course = await courseManager.findById(data.courseId);
        if (!course) throw new Error("El curso especificado no existe.");

        // 2️⃣ Verificar si ya existe el usuario con ese email
        const existingUser = await userManager.findByEmail(data.email!);

        // 3️⃣ Verificar si ya hay una solicitud para ese mismo curso
        const existingInfo = await this.findBy({
            email: data.email,
            courseId: new Types.ObjectId(data.courseId),
        });

        let status: string;

        if (existingInfo) {
            // Ya existe una solicitud previa
            if (existingInfo.status === InformationStatus.INFORMAR) {
                // Ya había solicitado información → se marca como INFORMADO
                status = InformationStatus.INFORMADO;
            } else {
                // En cualquier otro caso, vuelve al estado de INFORMAR
                status = InformationStatus.INFORMAR;
            }

            // 🔄 Actualizamos el registro en lugar de crear uno nuevo
            const updatedInfo = await this.editOne(existingInfo._id.toString(), {
                status,
                updatedAt: new Date(),
            });

            return updatedInfo!;
        }

        // 4️⃣ Si no existía solicitud previa, asignamos estado según si es usuario o no
        status = existingUser
            ? InformationStatus.USUARIOAINFORMAR
            : InformationStatus.INFORMAR;

        // 5️⃣ Crear nuevo registro de información
        const newInfo = await this.save({
            ...data,
            courseId: new Types.ObjectId(data.courseId),
            status,
        });

        return newInfo;
    }

    /**
     * Convierte una solicitud de información en usuario registrado.
     */
    async convertToUser(informationId: string) {
        const info = await this.findById(informationId);
        if (!info) throw new Error("No se encontró la información especificada.");

        // Verificar curso
        if (!info["courseId"]) {
            throw new Error("La solicitud no tiene asociado un curso válido.");
        }

        const course = await courseManager.findById(info["courseId"].toString());
        if (!course) throw new Error("El curso asociado ya no existe.");

        // Verificar si ya existe un usuario
        const existingUser = await userManager.findByEmail(info.email);
        if (existingUser) throw new Error("Ya existe un usuario con ese email.");

        // 🧩 Generar contraseña por defecto segura según regex
        const lastName = info.lastName?.trim() || "User";
        const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
        const defaultPassword = `${formattedLastName}_1234`; // cumple el regex

        // Crear nuevo usuario con el manager
        const newUser = await userManager.save({
            firstName: info.firstName,
            lastName: info.lastName,
            email: info.email,
            phone: info.phone,
            address: "No especificada",
            password: defaultPassword,
            role: UserRole.STUDENT,
        });

        // Actualizar estado a INFORMADO
        const updatedInfo = await this.editOne(informationId, {
            status: InformationStatus.INFORMADO,
        });

        // Retornar ambos resultados
        return { user: newUser, info: updatedInfo };
    }

}

const informationManager = new InformationManager();
export { informationManager };
export default InformationManager;
