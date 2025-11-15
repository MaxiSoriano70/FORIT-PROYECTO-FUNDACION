import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRole } from '../../shared/enums/userRole';
import { User } from '../../shared/entities/user';

@Component({
  selector: 'app-modal-add-form-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-form-student.component.html',
  styleUrl: './modal-add-form-student.component.css'
})
export class ModalAddFormStudentComponent implements OnInit {

  studentForm!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)
        ]
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],

      role: [UserRole.STUDENT, Validators.required],
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;

      const cleanLastName = formValue.lastName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      formValue.password = `${cleanLastName}_1234`;

      this.activeModal.close(formValue as User);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}
