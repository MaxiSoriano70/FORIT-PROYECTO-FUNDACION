import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { of } from 'rxjs';
import { InformacionComponent } from '../../../app/features/informacion/informacion.component';
import { IInformation } from '../../../shared/entities/information';
import { Component, EventEmitter } from '@angular/core';
import { InformacionServiceService } from '../../../app/features/informacion/informacion-service.service';
import { InformationStatus } from '../../../shared/enums/informationStatus';

@Component({
    selector: 'app-table-information',
    standalone: true,
    template: `
    <div style="border:1px solid #ccc; padding:20px;">
      <h3>Tabla de Información (Mock)</h3>

      <div *ngFor="let info of informations">
        <p>
          <strong>{{ info.firstName }} {{ info.lastName }}</strong> —
          {{ info.email }} —
          Curso: {{ info.courseName || 'No asignado' }} —
          Estado: {{ info.status }}
        </p>

        <button (click)="editInformation.emit(info)" class="btn btn-primary btn-sm me-2">Editar</button>
        <button (click)="deleteInformation.emit(info)" class="btn btn-danger btn-sm me-2">Eliminar</button>
        <button (click)="convertToUser.emit(info)" class="btn btn-success btn-sm">Convertir</button>

        <hr />
      </div>
    </div>
  `,
    inputs: ['informations'],
    outputs: ['editInformation', 'deleteInformation', 'convertToUser']
})
class MockTableInformationComponent {
    informations!: IInformation[];
    editInformation = new EventEmitter<IInformation>();
    deleteInformation = new EventEmitter<IInformation>();
    convertToUser = new EventEmitter<IInformation>();
}

@Component({
    selector: 'app-loading',
    standalone: true,
    template: `<div style="padding:40px; text-align:center;">Cargando...</div>`
})
class MockLoadingComponent { }

@Component({
    selector: 'app-edteam',
    standalone: true,
    template: `<div style="margin-top:20px; opacity:.3;">[EDteam Banner Mock]</div>`
})
class MockEdteamComponent { }

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `<div style="margin-top:30px; padding:20px; background:#eee;">[Footer Mock]</div>`
})
class MockFooterComponent { }

const mockInformation: IInformation[] = [
    {
        _id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '123456789',
        courseId: 'c1',
        status: InformationStatus.INFORMAR,
        courseName: 'Desarrollo Web',
    },
    {
        _id: '2',
        firstName: 'Ana',
        lastName: 'Gómez',
        email: 'ana@example.com',
        phone: '987654321',
        courseId: 'c2',
        status: InformationStatus.INFORMAR,
        courseName: 'Diseño UX/UI',
    }
] as any;

class MockInformacionService {
    getAll() {
        return of(mockInformation);
    }
    update() { return of(null); }
    delete() { return of(null); }
    convertToUser() { return of(null); }
}

export default {
    title: 'Pages/Información/Listado',
    component: InformacionComponent,
    decorators: [
        moduleMetadata({
            imports: [
                MockTableInformationComponent,
                MockLoadingComponent,
                MockEdteamComponent,
                MockFooterComponent
            ],
            providers: [
                { provide: InformacionServiceService, useClass: MockInformacionService }
            ]
        })
    ]
} as Meta<InformacionComponent>;

type Story = StoryObj<InformacionComponent>;

export const Default: Story = {};

export const SinRegistros: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                { provide: InformacionServiceService, useValue: { getAll: () => of([]) } }
            ]
        })
    ]
};
