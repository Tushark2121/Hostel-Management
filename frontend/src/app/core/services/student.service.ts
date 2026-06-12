import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private API = '/api/students';
  constructor(private http: HttpClient) {}

  getAll(filters?: { search?: string; block?: string; feeStatus?: string }) {
    let params = new HttpParams();
    if (filters?.search)    params = params.set('search', filters.search);
    if (filters?.block)     params = params.set('block', filters.block);
    if (filters?.feeStatus) params = params.set('feeStatus', filters.feeStatus);
    return this.http.get<any[]>(this.API, { params });
  }

  getById(id: string)       { return this.http.get<any>(`${this.API}/${id}`); }
  create(data: any)         { return this.http.post<any>(this.API, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string)        { return this.http.delete<any>(`${this.API}/${id}`); }
}
