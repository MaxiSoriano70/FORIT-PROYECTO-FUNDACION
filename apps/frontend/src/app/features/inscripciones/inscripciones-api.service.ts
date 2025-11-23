import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Course } from '../../../shared/entities/course';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesApiService {

  private apiBase = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Course[]> {
    return this.http
      .get<{ message: string; data: Course[] }>(`${this.apiBase}/course/`)
      .pipe(
        map(response => response.data)
      );
  }
}
