import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../shared/entities/course';
import { Category } from '../../shared/entities/category';
import { User } from '../../shared/entities/user';
import { CursosAPIService } from '../features/cursos/cursos-api.service';
declare const swal: any;

@Component({
  selector: 'app-modal-add-form-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-form-course.component.html',
  styleUrl: './modal-add-form-course.component.css'
})
export class ModalAddFormCourseComponent implements OnInit {

  courseForm!: FormGroup;
  categorias: Category[] = [];
  teachers: User[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cursosApi: CursosAPIService
  ) {}

  ngOnInit(): void {
    let storedUserId: string | null = null;
    if (typeof localStorage !== 'undefined') {
      try {
        const u = localStorage.getItem('usuarioLogueado');
        if (u) {
          const parsed = JSON.parse(u);
          storedUserId = parsed?._id || parsed?.id || null;
        }
      } catch {
        storedUserId = null;
      }
    }

    this.courseForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]{3,100}$/)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      durationMonths: [1, [Validators.required, Validators.min(1), Validators.max(60)]],
      schedule: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      pricePerMonth: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      adminId: [storedUserId || '', Validators.required],
      teacherId: [null],
      maxCapacity: [1, [Validators.required, Validators.min(1), Validators.max(500)]],
      enrolledCount: [0],
      imageUrl: ['', [
        Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i)
      ]]
    });

    this.loadCategories();
    this.loadTeachers();
  }

  loadCategories(): void {
    this.cursosApi.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  loadTeachers(): void {
    this.cursosApi.getTeachers().subscribe({
      next: (data) => (this.teachers = data),
      error: (err) => console.error('Error al cargar profesores', err)
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const raw = this.courseForm.value;

      // Validar adminId
      const adminId = raw.adminId || null;
      if (!adminId) {
        swal('Error', 'No se encontró el administrador logueado. Inicia sesión nuevamente.', 'error');
        return;
      }

      // Validar teacherId: si viene y no está en la lista de teachers, lo ignoramos (null)
      let teacherId = raw.teacherId ?? null;
      if (teacherId) {
        const found = this.teachers.find(t => (t._id || (t as any).id) === teacherId);
        if (!found) {
          teacherId = null;
        }
      }

      // Construir el objeto Course a enviar
      const formValue: Course = {
        ...raw,
        adminId,
        teacherId,
        startDate: raw.startDate ? new Date(raw.startDate) : undefined,
        endDate: raw.endDate ? new Date(raw.endDate) : undefined,
      };

      this.activeModal.close(formValue);
    } else {
      this.courseForm.markAllAsTouched();
    }
  }
}
