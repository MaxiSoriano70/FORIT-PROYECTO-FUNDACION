import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TableRegistrationsComponent } from "../../table-registrations/table-registrations.component";
import { CartelNoHayComponent } from "../../cartel-no-hay/cartel-no-hay.component";
import { LoadingComponent } from "../../loading/loading.component";
import { FooterComponent } from "../../footer/footer.component";
import { RollingCodeComponent } from "../../rolling-code/rolling-code.component";
import { InscripcionesApiService } from './inscripciones-api.service';
import { Course } from '../../../shared/entities/course';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    TableRegistrationsComponent,
    CartelNoHayComponent,
    LoadingComponent,
    RollingCodeComponent,
    FooterComponent
  ],
  templateUrl: './inscripciones.component.html',
  styleUrl: './inscripciones.component.css'
})
export class InscripcionesComponent implements OnInit {

  courses$!: Observable<Course[]>;

  constructor(
    private inscripcionesService: InscripcionesApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCursos();
  }

  loadCursos() {
    this.courses$ = this.inscripcionesService.getCursos();
  }

  goToCourse(course: Course) {
    this.router.navigate(['/inscripcionesxcurso', course._id]);
  }
}
