import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MisCursosApiService } from './mis-cursos-api.service';
import { forkJoin } from 'rxjs';

import { Sesion } from '../../ngrx/auth/auth.model';
import { User } from '../../../shared/entities/user';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-cursos.component.html',
  styleUrl: './mis-cursos.component.css'
})
export class MisCursosComponent implements OnInit {

  usuario!: User | null;
  cursosCompletos: any[] = [];
  loading = true;

  constructor(
    private store: Store<{ sesion: Sesion }>,
    private misCursosService: MisCursosApiService
  ) {}

  ngOnInit(): void {

    this.store.select(state => state.sesion.usuarioLogueado).subscribe(user => {
      this.usuario = user;

      if (user?._id) {
        this.cargarMisCursos(user._id);
      }
    });
  }

  cargarMisCursos(studentId: string) {
    this.misCursosService.getInscripcionesByStudent(studentId).subscribe(inscripciones => {
      if (!inscripciones.length) {
        this.loading = false;
        return;
      }

      const peticionesCursos = inscripciones.map(ins =>
        this.misCursosService.getCursoById(ins.courseId)
      );

      forkJoin(peticionesCursos).subscribe(cursos => {
        this.cursosCompletos = inscripciones.map((ins, i) => ({
          ...ins,
          curso: cursos[i]
        }));

        this.loading = false;
      });
    });
  }
}
