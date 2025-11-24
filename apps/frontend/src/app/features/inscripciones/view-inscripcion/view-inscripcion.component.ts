import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewInscripcionApiService } from './view-inscripcion-api.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
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
  inscripciones: any[] = [];
  alumnosDisponibles: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private api: ViewInscripcionApiService
  ) { }

  async ngOnInit() {

    this.courseId = this.route.snapshot.paramMap.get('id')!;

    this.loading = true;

    // 1) Traer inscripciones del curso
    const regs = await firstValueFrom(this.api.getRegistrationsByCourse(this.courseId));

    // 2) Armar inscripciones con nombres
    this.inscripciones = await Promise.all(
      regs.map(async reg => {
        const user = await firstValueFrom(this.api.getUser(reg.studentId));
        return {
          ...reg,
          studentName: `${user.firstName} ${user.lastName}`
        };
      })
    );

    // 3) Traer TODOS los alumnos
    const todosLosAlumnos = await firstValueFrom(this.api.getAllStudents());

    // 4) Filtrar los ya inscriptos
    const idsInscriptos = new Set(this.inscripciones.map(i => i.studentId));

    this.alumnosDisponibles = todosLosAlumnos.filter(a => !idsInscriptos.has(a._id));

    this.loading = false;
  }

  registrarAlumno(body: { studentId: string; courseId: string }) {

    this.loading = true;

    this.api.createRegistration(body).subscribe({
      next: () => {
        swal("¡Éxito!", "Alumno agregado a la inscripción", "success");
        this.ngOnInit();
      },
      error: () => {
        this.loading = false;
        swal("Error", "No se pudo registrar el alumno", "error");
      }
    });

  }

}
