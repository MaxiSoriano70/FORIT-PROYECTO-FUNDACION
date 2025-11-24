import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Registration } from '../../shared/entities/registration';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddFormRegistrationComponent } from '../modal-add-form-registration/modal-add-form-registration.component';
declare const swal: any;

@Component({
  selector: 'app-toolbar-registration',
  standalone: true,
  imports: [],
  templateUrl: './toolbar-registration.component.html',
  styleUrl: './toolbar-registration.component.css'
})
export class ToolbarRegistrationComponent {

  @Input() alumnosDisponibles: any[] = [];
  @Input() courseId!: string;

  @Output() addRegistration = new EventEmitter<any>();

  constructor(private modalService: NgbModal) {}

  abrirModal() {
    const modalRef = this.modalService.open(ModalAddFormRegistrationComponent, { centered: true });

    modalRef.componentInstance.alumnosDisponibles = this.alumnosDisponibles;
    modalRef.componentInstance.courseId = this.courseId;

    modalRef.result.then(
      (newRegistration) => {
        if (newRegistration) {
          this.addRegistration.emit(newRegistration);
        }
      },
      () => {}
    );
  }
}

