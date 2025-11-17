import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToolbarCategoryComponent } from "../../toolbar-category/toolbar-category.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from "../../loading/loading.component";
import { TableCategoriesComponent } from "../../table-categories/table-categories.component";
import { Observable, of, switchMap } from 'rxjs';
import { Category } from '../../../shared/entities/category';
import { CategoriasApiService } from './categorias-api-service.service';
import { ModalEditFormCategoryComponent } from '../../modal-edit-form-category/modal-edit-form-category.component';
import { EdteamComponent } from "../../edteam/edteam.component";
import { FooterComponent } from "../../footer/footer.component";
declare const swal: any;

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarCategoryComponent,
    LoadingComponent,
    TableCategoriesComponent,
    EdteamComponent,
    FooterComponent
],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categories$!: Observable<Category[]>;

  constructor(
    private categoryApi: CategoriasApiService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories() {
    this.categories$ = this.categoryApi.getCategories();
  }

  onCategoryAdded(category: Category) {
    this.categoryApi.addCategory(category).pipe(
      switchMap(() => {
        this.loadCategories();
        return of(null);
      })
    ).subscribe({
      next: () => swal('Éxito', 'Categoría agregada correctamente.', 'success'),
      error: () => swal('Error', 'No se pudo agregar la categoría.', 'error')
    });
  }

  openEditModal(category: Category): void {
    const modalRef = this.modalService.open(ModalEditFormCategoryComponent, { centered: true });
    modalRef.componentInstance.category = { ...category };

    modalRef.result.then((updatedCategory: Category) => {
      if (updatedCategory) {
        this.categoryApi.updateCategory(category._id!, updatedCategory).pipe(
          switchMap(() => {
            this.loadCategories();
            return of(null);
          })
        ).subscribe({
          next: () => swal('Éxito', 'Categoría actualizada correctamente.', 'success'),
          error: () => swal('Error', 'Ocurrió un error al actualizar la categoría.', 'error')
        });
      }
    }).catch(() => { });
  }

  onCategoryDeleted(category: Category): void {
    swal({
      title: '¿Estás seguro?',
      text: `Eliminar la categoría: ${category.name}`,
      icon: 'warning',
      buttons: {
        cancel: 'Cancelar',
        confirm: {
          text: 'Sí, eliminar',
          value: true
        }
      },
      dangerMode: true
    }).then((willDelete: boolean) => {
      if (willDelete) {
        this.categoryApi.deleteCategory(category._id!).pipe(
          switchMap(() => {
            this.loadCategories();
            return of(null);
          })
        ).subscribe({
          next: () => swal('¡Eliminada!', 'La categoría fue eliminada correctamente.', 'success'),
          error: () => swal('Error', 'Ocurrió un error al eliminar la categoría.', 'error')
        });
      }
    });
  }
}
