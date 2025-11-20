import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { userEvent, within } from 'storybook/test';
import { provideMockStore } from '@ngrx/store/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlumnosComponent } from '../../../app/features/alumnos/alumnos.component';
import { ToolbarStudentComponent } from '../../../app/toolbar-student/toolbar-student.component';
import { TableStudentsComponent } from '../../../app/table-students/table-students.component';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { FooterComponent } from '../../../app/footer/footer.component';
import { EdteamComponent } from '../../../app/edteam/edteam.component';
import { AlumnosAPIService } from '../../../app/features/alumnos/alumnos-api.service';

export default {
    title: 'Pages/Alumnos',
    component: AlumnosComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                NgbModule,
                ToolbarStudentComponent,
                TableStudentsComponent,
                LoadingComponent,
                EdteamComponent,
                FooterComponent
            ],
            providers: [
                provideMockStore({
                    initialState: {
                        sesion: { usuarioLogueado: { _id: '1', firstName: 'Maxi' } }
                    }
                }),
                {
                    provide: AlumnosAPIService,
                    useValue: {
                        getAlumnos: () =>
                            of([
                                {
                                    _id: 's1',
                                    firstName: 'Juan',
                                    lastName: 'Pérez',
                                    email: 'juan@test.com',
                                    role: 'ESTUDIANTE'
                                },
                                {
                                    _id: 's2',
                                    firstName: 'Ana',
                                    lastName: 'Lopez',
                                    email: 'ana@test.com',
                                    role: 'ESTUDIANTE'
                                }
                            ]),

                        addalumno: (student: any) =>
                            of({ ...student, _id: 'mockID' }),

                        updateAlumno: (student: any) =>
                            of(student),

                        deleteAlumno: () =>
                            of(void 0)
                    }
                },

                {
                    provide: NgbModal,
                    useValue: {
                        open: () => {
                            const modalRef: any = {
                                componentInstance: {},
                                closed: of({
                                    firstName: 'Editado',
                                    lastName: 'Mock',
                                    email: 'editado@test.com',
                                    role: 'ESTUDIANTE'
                                })
                            };
                            return modalRef;
                        }
                    }
                }
            ]
        })
    ]
} as Meta<AlumnosComponent>;

const Template: StoryFn<AlumnosComponent> = (args) => ({
    props: { ...args }
});

export const Default = Template.bind({});
Default.args = {};

export const EditStudentFlow = Template.bind({});
EditStudentFlow.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await new Promise((r) => setTimeout(r, 300));

    const editButtons = canvas.getAllByRole('button', { name: /editar/i });

    await userEvent.click(editButtons[0]);

    await new Promise((r) => setTimeout(r, 200));
    console.log("Modal editado y cerrado (mock)");
};
