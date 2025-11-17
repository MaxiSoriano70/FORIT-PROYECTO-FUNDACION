import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { NavbarComponent } from '../../app/navbar/navbar.component';
import { FullnamePipe } from '../../shared/pipes/fullname.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

export default {
    title: 'Componentes/Navbar',
    component: NavbarComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                RouterTestingModule,
                NgbModule,
                FullnamePipe,
            ],
            providers: [provideMockStore({ initialState: { sesion: { usuarioLogueado: null } } })],
        }),
    ],
} as Meta<NavbarComponent>;

const Template: StoryFn<NavbarComponent> = (args) => ({
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    usuario$: of(null),
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
    usuario$: of({
        _id: '1',
        firstName: 'Maxi',
        lastName: 'Soriano',
        email: 'maxi@example.com',
        password: '123456',
        phone: '1234567890',
        address: 'Mi dirección',
        role: 'ADMIN',
        profileImage: '',
    }),
};
