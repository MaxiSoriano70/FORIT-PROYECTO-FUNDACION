import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ViewUsuarioComponent } from '../../../app/features/usuarios/view-usuario/view-usuario.component';
import { User } from '../../../shared/entities/user';
import { UserRole } from '../../../shared/enums/userRole';

const mockUser: User = {
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '3874567890',
    address: 'Av. Siempre Viva 123',
    email: 'juan.perez@example.com',
    role: UserRole.ADMIN,
    password: '123456',
};

const meta: Meta<ViewUsuarioComponent> = {
    title: 'Usuarios/ViewUsuario',
    component: ViewUsuarioComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule],
        }),
        (story) => ({
            template: `
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
        <div class="p-4">
          <story />
        </div>
      `,
        }),
    ],
    render: (args) => ({
        props: {
            ...args,
            goBack: () => console.log('goBack ejecutado'),
        },
    }),
};

export default meta;

type Story = StoryObj<ViewUsuarioComponent>;

export const Default: Story = {
    args: {
        user: mockUser,
    },
};
