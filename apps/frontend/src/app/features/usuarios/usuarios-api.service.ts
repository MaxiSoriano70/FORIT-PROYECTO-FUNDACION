import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../../../shared/entities/user';

@Injectable({
  providedIn: 'root'
})
export class UsuariosApiService {

  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  addUsuario(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/`, user);
  }

  getUsuarios(): Observable<User[]> {
    return this.http.get<{ message: string; data: User[]; method: string; url: string }>(`${this.baseUrl}/`)
      .pipe(
        map(response => response.data)
      );
  }

  updateUsuario(user: User): Observable<User> {
    if (!user._id) {
      throw new Error('El usuario debe tener un _id para actualizarse');
    }
    return this.http.put<User>(`${this.baseUrl}/${user._id}`, user);
  }

  deleteUsuario(user: User): Observable<void> {
    if (!user._id) {
      throw new Error('El usuario debe tener un _id para eliminarse');
    }
    return this.http.delete<void>(`${this.baseUrl}/${user._id}`);
  }
}
