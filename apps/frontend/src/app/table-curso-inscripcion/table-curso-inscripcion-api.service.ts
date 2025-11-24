import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableCursoInscripcionApiService {

  private apiBase = 'http://localhost:8080/api/course';

  constructor(private http: HttpClient) {}

  getCursoById(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${courseId}`);
  }
}
