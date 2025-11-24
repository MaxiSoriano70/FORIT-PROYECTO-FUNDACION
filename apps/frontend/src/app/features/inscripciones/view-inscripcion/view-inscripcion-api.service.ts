import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Registration } from '../../../../shared/entities/registration';
import { User } from '../../../../shared/entities/user';

@Injectable({
  providedIn: 'root'
})
export class ViewInscripcionApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getRegistrationsByCourse(courseId: string): Observable<Registration[]> {
    return this.http
      .get<{ message: string; data: Registration[] }>(`${this.baseUrl}/registration/course/${courseId}`)
      .pipe(
        map(response => response.data)
      );
  }

  getUser(userId: string): Observable<User> {
    return this.http
      .get<{ message: string; data: User }>(`${this.baseUrl}/user/${userId}`)
      .pipe(
        map(response => response.data)
      );
  }

  createRegistration(body: { studentId: string; courseId: string }) {
    return this.http.post<{ message: string; data: any }>(
      `${this.baseUrl}/registration`,
      body
    );
  }

  getAllStudents(): Observable<User[]> {
    return this.http
      .get<{ message: string; data: User[] }>(`${this.baseUrl}/user/role/ESTUDIANTE`)
      .pipe(map(res => res.data));
  }

  payQuota(registrationId: string, quantity: number = 1): Observable<any> {
    return this.http.patch<{ message: string; data: any }>(
      `${this.baseUrl}/registration/${registrationId}/quota`,
      { quantity }
    );
  }

  deactivateRegistration(registrationId: string) {
    return this.http.put(
      `${this.baseUrl}/registration/${registrationId}/abandon`,
      {}
    );
  }

  activateRegistration(registrationId: string) {
    return this.http.put(
      `${this.baseUrl}/registration/${registrationId}/activate`,
      {}
    );
  }

  deleteRegistration(registrationId: string) {
    return this.http.delete(
      `${this.baseUrl}/registration/${registrationId}`
    );
  }
}
