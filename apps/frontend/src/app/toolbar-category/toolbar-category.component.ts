import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddFormCategoryComponent } from '../modal-add-form-category/modal-add-form-category.component';
import { Category } from '../../shared/entities/category';
declare const swal: any;

@Component({
  selector: 'app-toolbar-category',
  imports: [],
  templateUrl: './toolbar-category.component.html',
  styleUrl: './toolbar-category.component.css'
})
export class ToolbarCategoryComponent {
  @Output() addCategory = new EventEmitter<Category>();

  constructor(private modalService: NgbModal) {}

  abrirModal() {
    const modalRef = this.modalService.open(ModalAddFormCategoryComponent, { centered: true });

    modalRef.result.then(
      (newCategory: Category) => {
        if (newCategory) {
          this.addCategory.emit(newCategory);
          swal("¡Éxito!", "La categoría fue agregada correctamente.", "success");
        }
      },
      () => {}
    );
  }
}
