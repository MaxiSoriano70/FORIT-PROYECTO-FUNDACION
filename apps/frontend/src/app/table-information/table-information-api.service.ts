import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableInformationApiService {

  private baseUrl = "http://localhost:8080/api/user/email/";

  constructor(private http: HttpClient) {}

  isUserByEmail(email: string): Observable<boolean> {
    return this.http.get<{message: string, data: any}>(`${this.baseUrl}${email}`)
      .pipe(
        map(resp => !!resp.data),
        catchError(() => of(false))
      );
  }
}
