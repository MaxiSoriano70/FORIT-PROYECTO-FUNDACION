import { Component, EventEmitter, Output } from '@angular/core';
import { Course } from '../../shared/entities/course';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddFormCourseComponent } from '../modal-add-form-course/modal-add-form-course.component';
declare const swal: any;

@Component({
  selector: 'app-toolbar-course',
  imports: [],
  templateUrl: './toolbar-course.component.html',
  styleUrl: './toolbar-course.component.css'
})
export class ToolbarCourseComponent {
  @Output() addCourse = new EventEmitter<Course>();

  constructor(private modalService: NgbModal) { }

  abrirModal() {
    const modalRef = this.modalService.open(ModalAddFormCourseComponent, { centered: true });

    modalRef.result.then(
      (newCourse: Course) => {
        if (newCourse) {
          this.addCourse.emit(newCourse);
          swal("¡Éxito!", "El curso fue agregado correctamente.", "success");
        }
      },
      () => { }
    );
  }
}
