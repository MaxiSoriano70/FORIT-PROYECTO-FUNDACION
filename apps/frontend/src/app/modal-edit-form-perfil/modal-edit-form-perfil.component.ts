import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/entities/user';
declare const swal: any;

@Component({
  selector: 'app-modal-edit-form-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-edit-form-perfil.component.html',
  styleUrls: ['./modal-edit-form-perfil.component.css']
})
export class ModalEditFormPerfilComponent implements OnInit {

  @Input() user!: User;
  perfilForm!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      _id: [this.user._id],

      firstName: [
        this.user.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(35),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)
        ]
      ],

      lastName: [
        this.user.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(35),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)
        ]
      ],

      phone: [
        this.user.phone,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
          Validators.pattern(/^\+?[0-9]{8,15}$/)
        ]
      ],

      address: [
        this.user.address,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9 .,#-]+$/)
        ]
      ],

      email: [
        this.user.email,
        [Validators.required, Validators.email]
      ],

      profileImage: [
        this.user.profileImage,
        [
          Validators.pattern(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      swal('Error', 'Complete correctamente el formulario', 'error');
      return;
    }

    swal({
      title: '¿Guardar cambios?',
      text: 'Se actualizarán tus datos personales.',
      icon: 'warning',
      buttons: ['Cancelar', 'Sí, guardar'],
      dangerMode: true,
    }).then((willSave: boolean) => {
      if (willSave) {
        const updatedUser: User = {
          ...this.user,
          ...this.perfilForm.value,
          role: this.user.role
        };

        this.activeModal.close(updatedUser);
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
