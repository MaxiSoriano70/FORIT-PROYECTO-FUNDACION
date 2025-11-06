import { createReducer, on } from '@ngrx/store';
import { iniciarSesion, cerrarSesion } from './auth.actions';
import { Sesion } from './auth.model';

export const initialState: Sesion = {
    usuarioLogueado: null
};

export const sesionReducer = createReducer(
    initialState,
    on(iniciarSesion, (state, { usuario }) => ({
        ...state,
        usuarioLogueado: usuario
    })),
    on(cerrarSesion, state => ({
        ...state,
        usuarioLogueado: null
    }))
);