import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ) { }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      _id: [this.user._id],
      firstName: [
        this.user.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/),
        ],
      ],
      lastName: [
        this.user.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/),
        ],
      ],
      email: [
        this.user.email,
        [Validators.required, Validators.email],
      ],
      phone: [
        this.user.phone,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
          Validators.pattern(/^\+?[0-9]{8,15}$/),
        ],
      ],
      address: [
        this.user.address,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]{3,}$/),
        ],
      ],
      profileImage: [
        this.user.profileImage,
        [
          Validators.pattern(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i),
        ],
      ],
    });
  }


  onSubmit(): void {
    if (this.perfilForm.valid) {
      swal({
        title: '¿Estás seguro?',
        text: 'Se guardarán los cambios en tu perfil',
        icon: 'warning',
        buttons: ['Cancelar', 'Sí, guardar'],
        dangerMode: true,
      }).then((willSave: boolean) => {
        if (willSave) {
          const updatedUser = {
            ...this.user,
            ...this.perfilForm.value
          };

          // 👉 Lógica del servicio se agregará más adelante
          console.log('Datos actualizados del usuario:', updatedUser);
          swal('Info', 'Aquí irá la lógica del servicio EditPerfilService', 'info');

          // Cierra el modal de ejemplo
          this.activeModal.close(updatedUser);
        }
      });
    } else {
      this.perfilForm.markAllAsTouched();
      swal('Error', 'Complete correctamente el formulario', 'error');
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
