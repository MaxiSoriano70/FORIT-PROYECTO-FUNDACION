import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlumnosAPIService } from './alumnos-api.service';
import { User } from '../../../shared/entities/user';
import { TableStudentsComponent } from '../../table-students/table-students.component';
import { ToolbarStudentComponent } from '../../toolbar-student/toolbar-student.component';
import { LoadingComponent } from "../../loading/loading.component";
import { ModalEditFormStudentComponent } from '../../modal-edit-form-student/modal-edit-form-student.component';
import { Router } from '@angular/router';
import { EdteamComponent } from "../../edteam/edteam.component";
import { FooterComponent } from "../../footer/footer.component";

declare const swal: any;

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarStudentComponent,
    TableStudentsComponent,
    LoadingComponent,
    EdteamComponent,
    FooterComponent
],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent implements OnInit {

  students$!: Observable<User[]>;

  constructor(
    private alumnosApi: AlumnosAPIService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.students$ = this.alumnosApi.getAlumnos();
  }

  onStudentAdded(student: User): void {
    this.alumnosApi.addalumno(student).pipe(
      switchMap(() => {
        this.loadStudents();
        return of(null);
      })
    ).subscribe({
      next: () => swal("Éxito", "Alumno agregado correctamente.", "success"),
      error: () => swal("Error", "No se pudo agregar el alumno.", "error")
    });
  }

  openEditModal(student: User): void {
    const modalRef = this.modalService.open(ModalEditFormStudentComponent, { centered: true });
    modalRef.componentInstance.student = { ...student };

    modalRef.result.then((updatedStudent: User) => {
      if (updatedStudent) {
        this.alumnosApi.updateAlumno(updatedStudent).pipe(
          switchMap(() => {
            this.loadStudents();
            return of(null);
          })
        ).subscribe({
          next: () => swal("Éxito", "Alumno actualizado correctamente.", "success"),
          error: () => swal("Error", "No se pudo actualizar el alumno.", "error")
        });
      }
    }).catch(() => { });
  }

  onStudentDeleted(student: User): void {
    swal({
      title: '¿Estás seguro?',
      text: `Eliminar al alumno: ${student.firstName} ${student.lastName}`,
      icon: 'warning',
      buttons: {
        cancel: 'Cancelar',
        confirm: { text: 'Sí, eliminar', value: true }
      },
      dangerMode: true
    }).then((willDelete: boolean) => {
      if (willDelete) {
        this.alumnosApi.deleteAlumno(student).pipe(
          switchMap(() => {
            this.loadStudents();
            return of(null);
          })
        ).subscribe({
          next: () => swal("Eliminado", "El alumno fue eliminado correctamente.", "success"),
          error: () => swal("Error", "No se pudo eliminar el alumno.", "error")
        });
      }
    });
  }

  openDetailPage(student: User) {
    this.router.navigate(['/estudiantedetalle'], { state: { student } });
  }
}
