import { User } from "../../../shared/entities/user";

export interface Sesion{
    usuarioLogueado: User | null;
}