import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/entities/user';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ message: string, data: User }> {
    const body = { email, password };
    return this.http.post<{ message: string, data: User }>(`${this.baseUrl}/login`, body);
  }

}
