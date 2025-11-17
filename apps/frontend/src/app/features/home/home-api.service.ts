import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../../shared/entities/course';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {

  baseUrl = "http://localhost:8080/api/";

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Course[]> {
    return this.http.get<{ message: string, data: Course[] }>(`${this.baseUrl}course`)
      .pipe(
        map(response => response.data)
      );
  }

  createInformation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}information/`, data);
  }
}