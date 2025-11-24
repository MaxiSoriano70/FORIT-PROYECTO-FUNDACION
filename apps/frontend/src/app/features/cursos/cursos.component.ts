import { Component, OnInit } from '@angular/core';
import { ToolbarCourseComponent } from "../../toolbar-course/toolbar-course.component";
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CursosAPIService } from './cursos-api.service';
import { ModalEditFormCourseComponent } from '../../modal-edit-form-course/modal-edit-form-course.component';
import { Observable, of, switchMap } from 'rxjs';
import { LoadingComponent } from "../../loading/loading.component";
import { Course } from '../../../shared/entities/course';
import { TableCoursesComponent } from "../../table-courses/table-courses.component";
import { RollingCodeComponent } from "../../rolling-code/rolling-code.component";
import { FooterComponent } from "../../footer/footer.component";
import { Router } from '@angular/router';
import { CartelNoHayComponent } from "../../cartel-no-hay/cartel-no-hay.component";
declare const swal: any;

@Component({
  selector: 'app-cursos',
  imports: [CommonModule, ToolbarCourseComponent, LoadingComponent, TableCoursesComponent, RollingCodeComponent, FooterComponent, CartelNoHayComponent],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})

export class CursosComponent implements OnInit {
  courses$!: Observable<Course[]>;

  constructor(private cursosApi: CursosAPIService, private modalService: NgbModal, private router: Router) { }
  ngOnInit(): void {
    this.courses$ = this.cursosApi.getCursos();
  }

  private loadCourses() {
    this.courses$ = this.cursosApi.getCursos();
  }

  onCourseAdded(course: Course) {
    this.cursosApi.addCurso(course).pipe(
      switchMap(() => {
        this.loadCourses();
        return of(null);
      })
    ).subscribe({
      next: () => swal('Éxito', 'Curso agregado correctamente.', 'success'),
      error: () => swal('Error', 'No se pudo agregar el curso.', 'error')
    });
  }

  openEditModal(course: Course): void {
    const modalRef = this.modalService.open(ModalEditFormCourseComponent);
    modalRef.componentInstance.course = course;

    modalRef.result.then((updatedCourse: Course) => {
      if (updatedCourse) {
        this.cursosApi.updateCurso(updatedCourse).pipe(
          switchMap(() => {
            this.loadCourses();
            return of(null);
          })
        ).subscribe({
          next: () => swal('Éxito', 'Datos actualizados correctamente.', 'success'),
          error: () => swal('Error', 'Ocurrió un error al actualizar el curso.', 'error')
        });
      }
    }).catch(() => { });
  }

  onCourseDeleted(course: Course): void {
    swal({
      title: '¿Estás seguro?',
      text: `Eliminar al curso: ${course.name}`,
      icon: 'warning',
      buttons: {
        cancel: 'Cancelar',
        confirm: {
          text: 'Sí, eliminar',
          value: true
        }
      },
      dangerMode: true
    }).then((willDelete: boolean) => {
      if (willDelete) {
        this.cursosApi.deleteCurso(course).pipe(
          switchMap(() => {
            this.loadCourses();
            return of(null);
          })
        ).subscribe({
          next: () => swal('¡Eliminado!', 'El curso fue eliminado correctamente.', 'success'),
          error: () => swal('Error', 'Ocurrió un error al eliminar el curso.', 'error')
        });
      }
    });
  }

  openDetailPage(course: Course) {
    this.router.navigate(['/cursosdetalle'], { state: { course } });
  }
}
