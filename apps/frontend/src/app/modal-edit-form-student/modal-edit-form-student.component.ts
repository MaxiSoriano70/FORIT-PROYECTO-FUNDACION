import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../shared/entities/user';

@Component({
  selector: 'app-modal-edit-form-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './modal-edit-form-student.component.html',
  styleUrls: ['./modal-edit-form-student.component.css']
})
export class ModalEditFormStudentComponent implements OnInit {

  @Input() student!: User;
  studentForm!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: [
        this.student?.firstName || '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]
      ],
      lastName: [
        this.student?.lastName || '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]
      ],
      email: [
        this.student?.email || '',
        [Validators.required, Validators.email]
      ],
      phone: [
        this.student?.phone || '',
        [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]
      ],
      address: [
        this.student?.address || '',
        [Validators.required, Validators.minLength(5)]
      ]
    });
  }

  close(): void {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const updatedStudent: User = {
        ...this.student,
        ...this.studentForm.value,
        role: this.student.role
      };
      this.activeModal.close(updatedStudent);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}
