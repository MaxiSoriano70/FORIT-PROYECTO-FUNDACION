import { Component, OnInit } from '@angular/core';
import { TableRegistrationsComponent } from "../../table-registrations/table-registrations.component";
import { Course } from '../../../shared/entities/course';
import { InscripcionesApiService } from './inscripciones-api.service';
import { Router } from '@angular/router';
import { CartelNoHayComponent } from "../../cartel-no-hay/cartel-no-hay.component";
import { LoadingComponent } from "../../loading/loading.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../footer/footer.component";
import { RollingCodeComponent } from '../../rolling-code/rolling-code.component';
@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, TableRegistrationsComponent, CartelNoHayComponent, LoadingComponent, RollingCodeComponent, FooterComponent],
  templateUrl: './inscripciones.component.html',
  styleUrl: './inscripciones.component.css'
})
export class InscripcionesComponent implements OnInit {

  courses: Course[] = [];
  isLoading = true;

  constructor(
    private inscripcionesService: InscripcionesApiService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.inscripcionesService.getCursos().subscribe({
      next: data => {
        this.courses = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error cargando cursos', err);
        this.isLoading = false;
      }
    });
  }

  goToCourse(course: Course) {
    this.router.navigate(['/inscripcionesxcurso', course._id]);
  }
}

