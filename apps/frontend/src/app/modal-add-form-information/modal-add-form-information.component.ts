import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-add-form-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-form-information.component.html',
  styleUrl: './modal-add-form-information.component.css'
})
export class ModalAddFormInformationComponent {
  @Input() courseId!: string;
  infoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.infoForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/)
        ]
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?[0-9]{8,15}$/)
        ]
      ],
      courseId: [this.courseId]
    });
  }

  onSubmit() {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    this.activeModal.close(this.infoForm.value);
  }

  close() {
    this.activeModal.dismiss();
  }
}
