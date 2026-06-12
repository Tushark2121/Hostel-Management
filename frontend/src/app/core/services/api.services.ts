import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private API = '/api/rooms';
  constructor(private http: HttpClient) {}
  getAll(filters?: { block?: string; status?: string }) {
    let params = new HttpParams();
    if (filters?.block)  params = params.set('block', filters.block);
    if (filters?.status) params = params.set('status', filters.status);
    return this.http.get<any[]>(this.API, { params });
  }
  getById(id: string)               { return this.http.get<any>(`${this.API}/${id}`); }
  create(data: any)                 { return this.http.post<any>(this.API, data); }
  update(id: string, data: any)     { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string)                { return this.http.delete<any>(`${this.API}/${id}`); }
  allot(roomId: string, studentId: string)  { return this.http.post<any>(`${this.API}/${roomId}/allot`,  { studentId }); }
  vacate(roomId: string, studentId: string) { return this.http.post<any>(`${this.API}/${roomId}/vacate`, { studentId }); }
}

@Injectable({ providedIn: 'root' })
export class FeeService {
  private API = '/api/fees';
  constructor(private http: HttpClient) {}
  getAll(filters?: { status?: string; month?: string }) {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.month)  params = params.set('month', filters.month);
    return this.http.get<any[]>(this.API, { params });
  }
  getByStudent(studentId: string) { return this.http.get<any[]>(`${this.API}/student/${studentId}`); }
  getSummary()                    { return this.http.get<any>(`${this.API}/summary/stats`); }
  create(data: any)               { return this.http.post<any>(this.API, data); }
  update(id: string, data: any)   { return this.http.put<any>(`${this.API}/${id}`, data); }
  pay(id: string, amount: number) { return this.http.post<any>(`${this.API}/${id}/pay`, { amount }); }
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private API = '/api/complaints';
  constructor(private http: HttpClient) {}
  getAll(filters?: { status?: string; category?: string }) {
    let params = new HttpParams();
    if (filters?.status)   params = params.set('status', filters.status);
    if (filters?.category) params = params.set('category', filters.category);
    return this.http.get<any[]>(this.API, { params });
  }
  create(data: any)               { return this.http.post<any>(this.API, data); }
  update(id: string, data: any)   { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string)              { return this.http.delete<any>(`${this.API}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class NoticeService {
  private API = '/api/notices';
  constructor(private http: HttpClient) {}
  getAll()                        { return this.http.get<any[]>(this.API); }
  create(data: any)               { return this.http.post<any>(this.API, data); }
  update(id: string, data: any)   { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string)              { return this.http.delete<any>(`${this.API}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class VisitorService {
  private API = '/api/visitors';
  constructor(private http: HttpClient) {}
  getAll()                        { return this.http.get<any[]>(this.API); }
  create(data: any)               { return this.http.post<any>(this.API, data); }
  checkout(id: string)            { return this.http.put<any>(`${this.API}/${id}/checkout`, {}); }
  delete(id: string)              { return this.http.delete<any>(`${this.API}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class MessService {
  private API = '/api/mess';
  constructor(private http: HttpClient) {}
  getAll()                        { return this.http.get<any[]>(this.API); }
  update(id: string, data: any)   { return this.http.put<any>(`${this.API}/${id}`, data); }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  getStats() { return this.http.get<any>('/api/dashboard/stats'); }
}
