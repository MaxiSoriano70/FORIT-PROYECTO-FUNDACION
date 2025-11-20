import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewCursoComponent } from '../../../app/features/cursos/view-curso/view-curso.component';
import { Course } from '../../../shared/entities/course';

const mockCourse: Course = {
    _id: '123456789',
    name: 'Desarrollo Web Full Stack',
    description: 'Aprende HTML, CSS, JavaScript, Node.js y Angular.',
    durationMonths: 8,
    schedule: 'Lunes y Miércoles 18:30 - 21:30',
    pricePerMonth: 25000,
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-11-01'),
    enrolledCount: 12,
    maxCapacity: 20,
    categoryId: 'cat-1',
    adminId: 'admin-001',
    teacherId: 'prof-123',

    imageUrl: 'https://picsum.photos/800/300',
    createdAt: new Date(),
    updatedAt: new Date()
};


export default {
    title: 'Pages/Cursos/DetalleCurso',
    component: ViewCursoComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, RouterTestingModule]
        })
    ],
    args: {
        course: mockCourse
    }
} as Meta<ViewCursoComponent>;

type Story = StoryObj<ViewCursoComponent>;

export const Default: Story = {
    render: (args) => ({
        component: ViewCursoComponent,
        props: {
            ...args,
            goBack: () => alert('Volver presionado — Storybook')
        }
    })
};

export const ConDatosMinimos: Story = {
    args: {
        course: {
            _id: '999',
            name: 'Curso Express',
            description: 'Curso breve introductorio.',
            durationMonths: 1,
            schedule: 'Sábados 10:00 - 13:00',
            pricePerMonth: 5000,
            startDate: new Date(),
            endDate: new Date(),
            enrolledCount: 5,
            maxCapacity: 10,

            categoryId: 'cat-test',
            adminId: 'admin-test',
            teacherId: null,

            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
};

export const SinDatos: Story = {
    args: {
        course: undefined
    }
};
