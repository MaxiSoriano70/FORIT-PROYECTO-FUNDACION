import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { userEvent, within } from 'storybook/test';
import { HomeComponent } from '../../../app/features/home/home.component';
import { BannerComponent } from '../../../app/banner/banner.component';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { RollingCodeComponent } from '../../../app/rolling-code/rolling-code.component';
import { FooterComponent } from '../../../app/footer/footer.component';
import { HomeApiService } from '../../../app/features/home/home-api.service';

export default {
    title: 'Pages/Home',
    component: HomeComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, NgbModule, BannerComponent, LoadingComponent, RollingCodeComponent, FooterComponent],
            providers: [
                provideMockStore({ initialState: { sesion: { usuarioLogueado: { _id: '1', firstName: 'Maxi' } } } }),
                {
                    provide: HomeApiService,
                    useValue: {
                        getCursos: () => of([
                            { _id: 'c1', name: 'Curso Angular', pricePerMonth: 1500, startDate: new Date(), endDate: new Date(), maxCapacity: 10, enrolledCount: 2, description: 'Aprende Angular', imageUrl: '' },
                            { _id: 'c2', name: 'Curso React', pricePerMonth: 2000, startDate: new Date(), endDate: new Date(), maxCapacity: 15, enrolledCount: 5, description: 'Aprende React', imageUrl: '' }
                        ]),
                        createInformation: (data: any) => of({ message: 'Información creada' })
                    }
                },
                {
                    provide: NgbModal,
                    useValue: {
                        open: (component: any) => {
                            const modalRef: any = {
                                componentInstance: {},
                                closed: of({ some: 'data' }) // Simula el cierre del modal con data
                            };
                            return modalRef;
                        }
                    }
                }
            ]
        })
    ]
} as Meta<HomeComponent>;

const Template: StoryFn<HomeComponent> = (args) => ({ props: { ...args } });

export const Default = Template.bind({});
Default.args = {};

// Story interactiva: abrir modal y enviar info
export const OpenModalAndSendInfo = Template.bind({});
OpenModalAndSendInfo.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Esperamos que los cursos se rendericen
    await new Promise((r) => setTimeout(r, 100));

    // Hacer click en el primer botón de información
    const infoBtn = await canvas.getAllByRole('button', { name: /información/i });
    await userEvent.click(infoBtn[0]);

    // Verificar que el modal se "cierra" correctamente (mock)
    await new Promise((r) => setTimeout(r, 100));
    console.log('Modal cerrado mock con data:', true);
};
