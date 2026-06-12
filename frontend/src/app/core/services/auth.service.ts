import { Injectable, signal } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Router }             from '@angular/router';
import { tap }                from 'rxjs/operators';

export interface AuthUser {
  id: string; username: string; email: string; role: 'admin' | 'student';
  student?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = '/api/auth';
  private _user = signal<AuthUser | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('rx_user');
    if (stored) this._user.set(JSON.parse(stored));
  }

  get token(): string | null { return localStorage.getItem('rx_token'); }
  currentUser()              { return this._user(); }
  isLoggedIn()               { return !!this.token && !!this._user(); }

  login(username: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.API}/login`, { username, password })
      .pipe(tap(res => {
        localStorage.setItem('rx_token', res.token);
        localStorage.setItem('rx_user',  JSON.stringify(res.user));
        this._user.set(res.user);
      }));
  }

  logout() {
    localStorage.removeItem('rx_token');
    localStorage.removeItem('rx_user');
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
