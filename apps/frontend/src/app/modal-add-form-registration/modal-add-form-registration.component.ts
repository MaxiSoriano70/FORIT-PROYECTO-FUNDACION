import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-form-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-form-registration.component.html',
  styleUrl: './modal-add-form-registration.component.css'
})
export class ModalAddFormRegistrationComponent implements OnInit {

  @Input() courseId!: string;
  @Input() alumnosDisponibles: any[] = [];

  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      studentId: ['', Validators.required],
      courseId: [this.courseId]
    });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.activeModal.close(this.registrationForm.value);
  }

  close() {
    this.activeModal.dismiss();
  }
}
