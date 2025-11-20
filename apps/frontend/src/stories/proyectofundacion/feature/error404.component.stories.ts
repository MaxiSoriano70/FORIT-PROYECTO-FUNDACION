import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Error404Component } from '../../../app/features/error404/error404.component';

export default {
    title: 'Pages/General/Error404',
    component: Error404Component,
    decorators: [
        moduleMetadata({
            imports: [CommonModule]
        })
    ],
    args: {
        goBack: () => alert('Volver presionado — Storybook')
    }
} as Meta<Error404Component>;

type Story = StoryObj<Error404Component>;

export const Default: Story = {
    render: (args) => ({
        component: Error404Component,
        props: {
            ...args,
            goBack: () => alert('Volver presionado — Storybook')
        }
    })
};

export const SoloImagen: Story = {
    render: () => ({
        template: `
      <div style="text-align:center; margin-top:40px">
        <img src="assets/imagenes/error-404.png" style="max-width:300px" />
        <p>Solo vista de imagen 404</p>
      </div>
    `
    })
};

export const SinBotonVolver: Story = {
    render: (args) => ({
        component: Error404Component,
        props: {
            ...args,
            goBack: () => null
        },
        template: `
      <div class="container-fluid d-flex flex-column align-items-center justify-content-center mt-5 mb-5 text-center">
        <div class="d-flex align-items-center mb-3">
            <h1 class="me-3">Error</h1>
            <img src="assets/imagenes/error-404-cartel.png" class="img-fluid" style="max-width: 60px;">
        </div>
        <img src="assets/imagenes/error-404.png" class="img-fluid" style="max-width: 300px;">
        <!-- Botón eliminado -->
      </div>
    `
    })
};
