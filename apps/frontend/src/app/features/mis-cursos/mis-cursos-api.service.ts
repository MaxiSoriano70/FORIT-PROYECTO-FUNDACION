import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MisCursosApiService {

  private apiBase = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  getInscripcionesByStudent(studentId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiBase}registration/student/${studentId}`)
      .pipe(
        map(resp => resp.data)
      );
  }

  getCursoById(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBase}course/${courseId}`)
      .pipe(map(resp => resp.data));
  }
}
