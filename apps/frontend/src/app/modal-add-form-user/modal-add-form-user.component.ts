import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../shared/entities/user';
import { UserRole } from '../../shared/enums/userRole';

@Component({
  selector: 'app-modal-add-form-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-form-user.component.html',
  styleUrl: './modal-add-form-user.component.css'
})
export class ModalAddFormUserComponent implements OnInit {

  userForm!: FormGroup;
  roleOptions = Object.values(UserRole);

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
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
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{8,15}$/) // 8 a 15 dígitos
        ]
      ],
      address: ['', [Validators.required, Validators.minLength(5)]],
      role: [UserRole.STUDENT, Validators.required],
      password: ['']
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      const cleanLastName = formValue.lastName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      formValue.password = `${cleanLastName}_1234`;

      this.activeModal.close(formValue as User);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
