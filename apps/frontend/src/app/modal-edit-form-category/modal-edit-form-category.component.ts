import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Category } from '../../shared/entities/category';

@Component({
  selector: 'app-modal-edit-form-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './modal-edit-form-category.component.html',
  styleUrls: ['./modal-edit-form-category.component.css']
})
export class ModalEditFormCategoryComponent implements OnInit {
  @Input() category!: Category;
  categoryForm!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [
        this.category?.name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9,. ]+$/)
        ]
      ],
      description: [
        this.category?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ]
    });
  }

  close(): void {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const updatedCategory: Category = {
        ...this.category,
        ...this.categoryForm.value
      };
      this.activeModal.close(updatedCategory);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
