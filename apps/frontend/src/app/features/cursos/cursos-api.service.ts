import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Course } from '../../../shared/entities/course';
import { Category } from '../../../shared/entities/category';
import { User } from '../../../shared/entities/user';

@Injectable({
  providedIn: 'root'
})

export class CursosAPIService {
  private apiBase = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  addCurso(course: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>): Observable<Course> {
    return this.http.post<Course>(`${this.apiBase}/course/`, course);
  }

  getCursos(): Observable<Course[]>{
    return this.http.get<{ message: string; data: Course[]; method?: string; url?: string }>(`${this.apiBase}/course/`)
      .pipe(
        map(response => response.data)
      );
  }

  updateCurso(course: Course): Observable<Course> {
    if (!course._id) throw new Error('El curso debe tener _id para actualizarse');
    return this.http.put<Course>(`${this.apiBase}/course/${course._id}`, course);
  }

  deleteCurso(course : Course): Observable<void>{
    if (!course._id) throw new Error('El curso debe tener _id para eliminarse');
    return this.http.delete<void>(`${this.apiBase}/course/${course._id}`);
  }

  getCategorias(): Observable<Category[]> {
    return this.http.get<{ message: string; data: Category[] }>(`${this.apiBase}/category/`)
      .pipe(
        map(response => response.data)
      );
  }

  getTeachers(): Observable<User[]> {
    return this.http.get<{ message: string; data: User[] }>(`${this.apiBase}/user/role/PROFESOR`)
      .pipe(
        map(response => response.data)
      );
  }
}
