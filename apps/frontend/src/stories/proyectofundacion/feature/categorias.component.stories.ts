import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { userEvent, within } from 'storybook/test';
import { CategoriasComponent } from '../../../app/features/categorias/categorias.component';
import { ToolbarCategoryComponent } from '../../../app/toolbar-category/toolbar-category.component';
import { TableCategoriesComponent } from '../../../app/table-categories/table-categories.component';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { EdteamComponent } from '../../../app/edteam/edteam.component';
import { FooterComponent } from '../../../app/footer/footer.component';

import { CategoriasApiService } from '../../../app/features/categorias/categorias-api-service.service';

const mockModalService = {
    open: () => {
        const modalRef: any = {
            componentInstance: {},
            result: Promise.resolve({
                _id: 'c1',
                name: 'Categoría Editada',
                description: 'Descripción nueva'
            })
        };
        return modalRef;
    }
};

const mockCategoryService = {
    getCategories: () => of([
        { _id: 'c1', name: 'Frontend', description: 'Tecnologías del front' },
        { _id: 'c2', name: 'Backend', description: 'Tecnologías del servidor' }
    ]),
    addCategory: (cat: any) => of({ ...cat, _id: 'new1' }),
    updateCategory: () => of(true),
    deleteCategory: () => of(true)
};

export default {
    title: 'Pages/Categorias',
    component: CategoriasComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ToolbarCategoryComponent,
                TableCategoriesComponent,
                LoadingComponent,
                EdteamComponent,
                FooterComponent
            ],
            providers: [
                provideMockStore({ initialState: {} }),
                { provide: CategoriasApiService, useValue: mockCategoryService },
                { provide: 'NgbModal', useValue: mockModalService }
            ]
        })
    ]
} as Meta<CategoriasComponent>;

const Template: StoryFn<CategoriasComponent> = (args) => ({
    props: { ...args }
});

export const Default = Template.bind({});
Default.args = {};
