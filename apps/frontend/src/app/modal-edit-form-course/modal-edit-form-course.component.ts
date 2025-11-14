import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Course } from '../../shared/entities/course';
import { Category } from '../../shared/entities/category';
import { User } from '../../shared/entities/user';
import { CursosAPIService } from '../features/cursos/cursos-api.service';
@Component({
  selector: 'app-modal-edit-form-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './modal-edit-form-course.component.html',
  styleUrls: ['./modal-edit-form-course.component.css']
})
export class ModalEditFormCourseComponent implements OnInit {
  @Input() course!: Course;
  courseForm!: FormGroup;

  categories: Category[] = [];
  teachers: User[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cursosApi: CursosAPIService
  ) { }

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      name: [this.course?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.course?.description || '', [Validators.required, Validators.minLength(10)]],
      durationMonths: [this.course?.durationMonths || 1, [Validators.required, Validators.min(1)]],
      schedule: [this.course?.schedule || '', [Validators.required]],
      startDate: [this.formatDate(this.course?.startDate), [Validators.required]],
      endDate: [this.formatDate(this.course?.endDate), [Validators.required]],
      pricePerMonth: [this.course?.pricePerMonth || 0, [Validators.required, Validators.min(0)]],
      categoryId: [this.course?.categoryId || '', Validators.required],
      teacherId: [this.course?.teacherId ?? null],
      maxCapacity: [this.course?.maxCapacity || 1, [Validators.required, Validators.min(1)]],
      imageUrl: [this.course?.imageUrl || '', Validators.pattern(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)],
    });

    this.loadData();
  }

  private loadData(): void {
    this.cursosApi.getCategorias().subscribe(data => (this.categories = data));
    this.cursosApi.getTeachers().subscribe(data => (this.teachers = data));
  }

  private formatDate(date?: Date | string): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

  close(): void {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const updatedCourse: Course = {
        ...this.course,
        ...this.courseForm.value,
      };
      this.activeModal.close(updatedCourse);
    } else {
      this.courseForm.markAllAsTouched();
    }
  }
}
