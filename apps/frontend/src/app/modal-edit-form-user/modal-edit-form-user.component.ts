import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../shared/entities/user'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-modal-edit-form-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './modal-edit-form-user.component.html',
  styleUrls: ['./modal-edit-form-user.component.css']
})
export class ModalEditFormUserComponent implements OnInit {
  @Input() user!: User;
  userForm!: FormGroup;
  roleOptions: string[] = ['ADMIN', 'PROFESOR', 'ESTUDIANTE'];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [
        this.user?.firstName || '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]
      ],
      lastName: [
        this.user?.lastName || '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]
      ],
      email: [
        this.user?.email || '',
        [Validators.required, Validators.email]
      ],
      phone: [
        this.user?.phone || '',
        [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]
      ],
      address: [
        this.user?.address || '',
        [Validators.required, Validators.minLength(5)]
      ],
      role: [this.user?.role || '', Validators.required]
    });
  }

  close(): void {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser: User = {
        ...this.user,
        ...this.userForm.value
      };
      this.activeModal.close(updatedUser);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
