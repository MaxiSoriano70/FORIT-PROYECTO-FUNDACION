import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { of } from 'rxjs';
import { User } from '../../../shared/entities/user';
import { Component, EventEmitter } from '@angular/core';
import { UsuariosComponent } from '../../../app/features/usuarios/usuarios.component';
import { UsuariosApiService } from '../../../app/features/usuarios/usuarios-api.service';

// --------------------------------------------------
// Mocks para componentes hijos
// --------------------------------------------------
@Component({
    selector: 'app-toolbar-user',
    standalone: true,
    template: `
    <div style="padding:15px; background:#eef; margin-bottom:15px;">
      <strong>Toolbar User Mock</strong>
      <button class="btn btn-primary btn-sm ms-2" (click)="addUser.emit(mockUser)">Agregar Usuario</button>
    </div>
  `
})
class MockToolbarUserComponent {
    mockUser: Partial<User> = {
        firstName: 'Nuevo',
        lastName: 'Usuario',
        email: 'nuevo@example.com'
    };
    addUser = new EventEmitter<User>();
}

@Component({
    selector: 'app-table-users',
    standalone: true,
    template: `
    <div style="border:1px solid #ccc; padding:15px;">
      <h4>Tabla Usuarios (Mock)</h4>

      <div *ngFor="let u of users" style="margin-bottom:10px;">
        <strong>{{ u.firstName }} {{ u.lastName }}</strong> —
        {{ u.email }}

        <button class="btn btn-sm btn-primary ms-2" (click)="editUser.emit(u)">Editar</button>
        <button class="btn btn-sm btn-danger ms-2" (click)="deleteUser.emit(u)">Eliminar</button>
        <button class="btn btn-sm btn-info ms-2" (click)="detailUser.emit(u)">Detalles</button>
      </div>
    </div>
  `,
    inputs: ['users'],
    outputs: ['editUser', 'deleteUser', 'detailUser']
})
class MockTableUsersComponent {
    users!: User[];
    editUser = new EventEmitter<User>();
    deleteUser = new EventEmitter<User>();
    detailUser = new EventEmitter<User>();
}

@Component({
    selector: 'app-loading',
    standalone: true,
    template: `<div style="padding:40px; text-align:center;">Cargando...</div>`
})
class MockLoadingComponent { }

@Component({
    selector: 'app-rolling-code',
    standalone: true,
    template: `<div style="opacity:.5; margin-top:25px;">[Rolling Code Mock]</div>`
})
class MockRollingCodeComponent { }

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `<div style="margin-top:30px; padding:20px; background:#eee;">[Footer Mock]</div>`
})
class MockFooterComponent { }

const mockUsers: User[] = [
    {
        _id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '123456',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '2',
        firstName: 'Ana',
        lastName: 'Gómez',
        email: 'ana@example.com',
        phone: '987654',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    }
] as any;

class MockUsuariosApiService {
    getUsuarios() {
        return of(mockUsers);
    }
    addUsuario() { return of(null); }
    updateUsuario() { return of(null); }
    deleteUsuario() { return of(null); }
}

export default {
    title: 'Pages/Usuarios/Listado',
    component: UsuariosComponent,
    decorators: [
        moduleMetadata({
            imports: [
                MockToolbarUserComponent,
                MockTableUsersComponent,
                MockLoadingComponent,
                MockRollingCodeComponent,
                MockFooterComponent
            ],
            providers: [
                { provide: UsuariosApiService, useClass: MockUsuariosApiService }
            ]
        })
    ]
} as Meta<UsuariosComponent>;

type Story = StoryObj<UsuariosComponent>;

export const Default: Story = {};

export const SinUsuarios: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                { provide: UsuariosApiService, useValue: { getUsuarios: () => of([]) } }
            ]
        })
    ]
};
