import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { userEvent, within } from 'storybook/test';
import { CursosComponent } from '../../../app/features/cursos/cursos.component';
import { ToolbarCourseComponent } from '../../../app/toolbar-course/toolbar-course.component';
import { TableCoursesComponent } from '../../../app/table-courses/table-courses.component';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { RollingCodeComponent } from '../../../app/rolling-code/rolling-code.component';
import { FooterComponent } from '../../../app/footer/footer.component';
import { CursosAPIService } from '../../../app/features/cursos/cursos-api.service';

const mockRouter = {
    navigate: (path: string[], extras: any) => {
        console.log('Navegando a:', path, 'con state:', extras?.state);
    }
};

const mockModalService = {
    open: () => {
        const modalRef: any = {
            componentInstance: {},
            result: Promise.resolve({
                _id: 'c1',
                name: 'Curso Editado',
                description: 'Nuevo contenido actualizado',
                category: 'Frontend',
                teacher: 'Profesor 1'
            })
        };
        return modalRef;
    }
};

const mockCursosApi = {
    getCursos: () =>
        of([
            {
                _id: 'c1',
                name: 'Angular desde Cero',
                description: 'Curso completo de Angular',
                category: 'Frontend',
                teacher: 'Juan Pérez'
            },
            {
                _id: 'c2',
                name: 'Node.js Profesional',
                description: 'Backend con Node',
                category: 'Backend',
                teacher: 'María López'
            }
        ]),
    addCurso: (c: any) => of({ ...c, _id: 'newX' }),
    updateCurso: () => of(true),
    deleteCurso: () => of(true),
    getCategorias: () => of([]),
    getTeachers: () => of([])
};

export default {
    title: 'Pages/Cursos',
    component: CursosComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ToolbarCourseComponent,
                TableCoursesComponent,
                LoadingComponent,
                RollingCodeComponent,
                FooterComponent
            ],
            providers: [
                { provide: CursosAPIService, useValue: mockCursosApi },
                { provide: 'NgbModal', useValue: mockModalService },
                { provide: 'Router', useValue: mockRouter }
            ]
        })
    ]
} as Meta<CursosComponent>;

const Template: StoryFn<CursosComponent> = (args) => ({
    props: { ...args }
});

export const Default = Template.bind({});
Default.args = {};
