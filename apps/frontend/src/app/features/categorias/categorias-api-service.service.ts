import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../../../shared/entities/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriasApiService {

  private baseUrl = 'http://localhost:8080/api/category';

  constructor(private http: HttpClient) { }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/`, category);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<{ message: string; data: Category[] }>(`${this.baseUrl}/`)
      .pipe(map(response => response.data)); // 👈 extraemos solo el array
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
