import { createAction, props } from "@ngrx/store";
import { User } from "../../../shared/entities/user";

export const iniciarSesion = createAction(
    '[Sesion] Iniciar Sesion',
    props<{ usuario: User }>()
);

export const cerrarSesion = createAction(
    '[Sesion] Cerrar Sesion'
);
