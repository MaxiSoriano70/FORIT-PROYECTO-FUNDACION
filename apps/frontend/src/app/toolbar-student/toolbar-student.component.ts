import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddFormStudentComponent } from '../modal-add-form-student/modal-add-form-student.component';
import { User } from '../../shared/entities/user';

declare const swal: any;

@Component({
  selector: 'app-toolbar-student',
  imports: [],
  templateUrl: './toolbar-student.component.html',
  styleUrl: './toolbar-student.component.css'
})

export class ToolbarStudentComponent {
  @Output() addStudent = new EventEmitter<User>();

  constructor(private modalService: NgbModal) {}

  abrirModal() {
    const modalRef = this.modalService.open(ModalAddFormStudentComponent, { centered: true });

    modalRef.result.then(
      (newStudent: User) => {
        if (newStudent) {
          this.addStudent.emit(newStudent);
          swal("¡Éxito!", "El estudiante fue agregado correctamente.", "success");
        } else {
          swal("Error", "No se pudo agregar el estudiante.", "error");
        }
      },
      () => {
        swal("Cancelado", "No se agregó ningún estudiante.", "info");
      }
    );
  }
}
