import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IInformation } from '../../shared/entities/information';

@Component({
  selector: 'app-modal-edit-form-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './modal-edit-form-information.component.html',
  styleUrls: ['./modal-edit-form-information.component.css']
})
export class ModalEditFormInformationComponent implements OnInit {

  @Input() info!: IInformation;
  infoForm!: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      firstName: [
        this.info.firstName,
        [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]
      ],
      lastName: [
        this.info.lastName,
        [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]
      ],
      email: [
        this.info.email,
        [Validators.required, Validators.email]
      ],
      phone: [
        this.info.phone,
        [Validators.required, Validators.pattern(/^[0-9+]{8,15}$/)]
      ]
    });
  }

  close(): void {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {
    if (this.infoForm.valid) {
      const updatedInfo: IInformation = {
        ...this.info,
        ...this.infoForm.value
      };

      this.activeModal.close(updatedInfo);
    } else {
      this.infoForm.markAllAsTouched();
    }
  }
}
