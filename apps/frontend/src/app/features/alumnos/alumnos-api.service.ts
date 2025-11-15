import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../shared/entities/user';

@Injectable({
  providedIn: 'root',
})
export class AlumnosAPIService {
  private apiBase = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  addalumno(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    return this.http.post<User>(`${this.apiBase}/`, user);
  }

  getAlumnos(): Observable<User[]> {
    return this.http.get<{ message: string; data: User[] }>(`${this.apiBase}/role/ESTUDIANTE`)
      .pipe(map(response => response.data));
  }

  updateAlumno(user: User): Observable<User> {
    if (!user._id) throw new Error('El usuario debe tener un _id para actualizarse');
    return this.http.put<User>(`${this.apiBase}/${user._id}`, user);
  }

  deleteAlumno(user: User): Observable<void> {
    if (!user._id) throw new Error('El usuario debe tener un _id para eliminarse');
    return this.http.delete<void>(`${this.apiBase}/${user._id}`);
  }
}

