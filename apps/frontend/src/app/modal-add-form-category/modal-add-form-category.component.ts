import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Category } from '../../shared/entities/category';

@Component({
  selector: 'app-modal-add-form-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './modal-add-form-category.component.html',
  styleUrls: ['./modal-add-form-category.component.css']
})
export class ModalAddFormCategoryComponent implements OnInit {
  categoryForm!: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9,. ]+$/)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ]
    });
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.categoryForm.markAsPristine();
    this.categoryForm.markAsUntouched();
  }

  close(): void {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      this.activeModal.close(formValue as Category);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
