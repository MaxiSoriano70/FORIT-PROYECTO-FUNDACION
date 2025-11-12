import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { LoginApiService } from './login-api.service';
import { User } from '../../shared/entities/user';
declare const swal: any;

@Component({
  selector: 'app-modal-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './modal-iniciar-sesion.component.html',
  styleUrls: ['./modal-iniciar-sesion.component.css']
})
export class ModalIniciarSesionComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginApi: LoginApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/)
      ]]
    });
  }

  close(): void {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      swal('Error', 'Complete correctamente el formulario', 'error');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loginApi.login(email, password).subscribe({
      next: (res) => {
        const usuario: User = res.data; // 👈 aseguramos que es del tipo User
        swal('Éxito', res.message || 'Inicio de sesión exitoso', 'success');
        this.activeModal.close(usuario);
      },
      error: (err) => {
        console.error('Error en login:', err);
        swal('Error', err.error?.message || 'Credenciales incorrectas', 'error');
      }
    });
  }
}
