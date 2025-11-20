import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ViewStudentComponent } from '../../../app/features/alumnos/view-student/view-student.component';

const mockRouter = {
    getCurrentNavigation: () => ({
        extras: {
            state: {
                student: {
                    _id: 's1',
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    phone: '3875001122',
                    address: 'Av. Siempre Viva 742',
                    email: 'juan@test.com',
                    role: 'ESTUDIANTE'
                }
            }
        }
    })
};

const mockLocation = {
    back: () => console.log('Volver (mock)')
};

export default {
    title: 'Pages/Student Detail',
    component: ViewStudentComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule],
            providers: [
                { provide: 'Router', useValue: mockRouter },
                { provide: 'Location', useValue: mockLocation }
            ],
        }),
    ],
} as Meta<ViewStudentComponent>;

const Template: StoryFn<ViewStudentComponent> = (args) => ({
    props: args,
});

export const Default = Template.bind({});
Default.args = {};
