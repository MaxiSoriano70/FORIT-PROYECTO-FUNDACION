import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ModalIniciarSesionComponent } from '../../app/modal-iniciar-sesion/modal-iniciar-sesion.component';
import { LoginApiService } from '../../app/modal-iniciar-sesion/login-api.service';
import { userEvent, within } from 'storybook/test';

export default {
    title: 'Componentes/Modal Iniciar Sesión',
    component: ModalIniciarSesionComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ReactiveFormsModule, NgbModule],
            providers: [
                provideMockStore({ initialState: { sesion: { usuarioLogueado: null } } }),
                // Servicio mockeado para Visual TDD
                {
                    provide: LoginApiService,
                    useValue: {
                        login: (email: string, password: string) =>
                            of({
                                message: 'Inicio de sesión simulado',
                                data: {
                                    _id: '1',
                                    firstName: 'Maxi',
                                    lastName: 'Soriano',
                                    email,
                                    role: 'ADMIN',
                                    profileImage: '',
                                },
                            }),
                    },
                },
                // Mock de modal
                {
                    provide: NgbActiveModal,
                    useValue: {
                        close: (payload?: any) => {
                            (globalThis as any).__storybook_modal_closed = payload ?? true;
                        },
                        dismiss: (reason?: any) => {
                            (globalThis as any).__storybook_modal_dismissed = reason ?? true;
                        },
                    },
                },
            ],
        }),
    ],
} as Meta<ModalIniciarSesionComponent>;

const Template: StoryFn<ModalIniciarSesionComponent> = (args) => ({
    props: { ...args },
});

export const Default = Template.bind({});
Default.args = {};

// Story simulando login exitoso
export const LoginSuccess = Template.bind({});
LoginSuccess.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = await canvas.getByPlaceholderText(/Ingrese su email/i);
    const passwordInput = await canvas.getByPlaceholderText(/Ingrese su contraseña/i);
    await userEvent.type(emailInput, 'adm@gmail.com');
    await userEvent.type(passwordInput, 'Admin123!');

    const submitBtn = await canvas.getByRole('button', { name: /Ingresar/i });
    await userEvent.click(submitBtn);

    // Esperamos que el observable del mock emita
    await new Promise((r) => setTimeout(r, 100));

    console.log('Modal cerrado mock:', (globalThis as any).__storybook_modal_closed);
};
