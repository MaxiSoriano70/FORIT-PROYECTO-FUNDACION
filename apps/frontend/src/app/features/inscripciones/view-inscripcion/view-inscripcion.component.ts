import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, of, switchMap, map } from 'rxjs';
import { ViewInscripcionApiService } from './view-inscripcion-api.service';
import { TableCursoInscripcionComponent } from '../../../table-curso-inscripcion/table-curso-inscripcion.component';
import { CartelNoHayComponent } from '../../../cartel-no-hay/cartel-no-hay.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { ToolbarRegistrationComponent } from "../../../toolbar-registration/toolbar-registration.component";
declare const swal: any;

@Component({
  selector: 'app-view-inscripcion',
  standalone: true,
  imports: [
    CommonModule,
    TableCursoInscripcionComponent,
    CartelNoHayComponent,
    LoadingComponent,
    ToolbarRegistrationComponent
  ],
  templateUrl: './view-inscripcion.component.html',
  styleUrl: './view-inscripcion.component.css'
})
export class ViewInscripcionComponent implements OnInit {

  courseId!: string;
  inscripciones$: Observable<any[]> = of([]);
  alumnosDisponibles$: Observable<any[]> = of([]);

  constructor(
    private route: ActivatedRoute,
    private api: ViewInscripcionApiService
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.loadInscripciones();
  }

  loadInscripciones() {
    this.inscripciones$ = this.api.getRegistrationsByCourse(this.courseId).pipe(
      map(regs => regs || []), // <-- aseguramos que nunca sea null
      switchMap(regs => {
        if (!regs.length) return of([]);

        const inscripcionesConNombres$ = regs.map(reg =>
          this.api.getUser(reg.studentId).pipe(
            map(user => ({
              ...reg,
              studentName: `${user.firstName} ${user.lastName}`
            }))
          )
        );

        return forkJoin(inscripcionesConNombres$);
      })
    );

    this.alumnosDisponibles$ = this.inscripciones$.pipe(
      switchMap(inscripciones =>
        this.api.getAllStudents().pipe(
          map(allStudents => (allStudents || []).filter(a => !inscripciones.some(i => i.studentId === a._id)))
        )
      )
    );
  }

  registrarAlumno(body: { studentId: string; courseId: string }) {
    this.api.createRegistration(body).subscribe({
      next: () => {
        swal("¡Éxito!", "Alumno agregado a la inscripción", "success");
        this.loadInscripciones();
      },
      error: () => swal("Error", "No se pudo registrar el alumno", "error")
    });
  }

}
