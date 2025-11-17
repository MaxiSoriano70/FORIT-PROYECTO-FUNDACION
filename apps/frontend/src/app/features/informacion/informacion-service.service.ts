import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { IInformation } from '../../../shared/entities/information';

@Injectable({
  providedIn: 'root'
})
export class InformacionServiceService {

  private baseUrl = "http://localhost:8080/api/";

  constructor(private http: HttpClient) {}

  getAll(): Observable<IInformation[]> {
    return this.http
      .get<{ message: string; data: IInformation[] }>(`${this.baseUrl}information/`)
      .pipe(
        map(resp => resp.data),
        switchMap((infos: IInformation[]) => {
          if (!infos.length) return of([]);

          const withCourses$ = infos.map(info =>
            this.getCourseName(info.courseId).pipe(
              map(courseName => ({ ...info, courseName }))
            )
          );

          return forkJoin(withCourses$);
        })
      );
  }

  getById(id: string): Observable<IInformation> {
    return this.http
      .get<{ message: string; data: IInformation }>(`${this.baseUrl}information/${id}`)
      .pipe(map(resp => resp.data));
  }

  update(id: string, info: Partial<IInformation>): Observable<any> {
    return this.http.put(`${this.baseUrl}information/${id}`, info);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}information/${id}`);
  }

  convertToUser(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}information/${id}/convert`, {});
  }

  getCourseName(courseId: string): Observable<string> {
    return this.http
      .get<{ message: string; data: any }>(`${this.baseUrl}course/${courseId}`)
      .pipe(map(resp => resp.data.name));
  }
}
