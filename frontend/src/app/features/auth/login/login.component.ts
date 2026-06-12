import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { Router }            from '@angular/router';
import { AuthService }       from '../../../core/services/auth.service';
import { ToastService }      from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div id="loginPage">
      <div class="login-wrapper">
        <div class="brand">
          <div class="brand-icon">🏠</div>
          <h1>Residence<span>X</span></h1>
          <p>Smart Hostel Management Platform</p>
        </div>

        <div class="role-tabs">
          <div class="role-tab" [class.active]="role === 'admin'"   (click)="setRole('admin')">🔐 Admin</div>
          <div class="role-tab" [class.active]="role === 'student'" (click)="setRole('student')">🎓 Student</div>
        </div>

        <div class="login-card">
          <div class="field">
            <label>Username / Email</label>
            <input type="text" [(ngModel)]="username" placeholder="Enter your credentials" />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="doLogin()" />
          </div>
          <button class="btn-primary" [disabled]="loading" (click)="doLogin()">
            {{ loading ? 'Signing in…' : 'Sign In →' }}
          </button>
          <div class="demo-hint">
            Demo: <strong>{{ role }} / {{ role === 'admin' ? 'admin123' : 'student123' }}</strong>
          </div>
          @if (error) {
            <div class="error-msg">{{ error }}</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    #loginPage { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; position: relative; z-index: 1; }
    .login-wrapper { width: 100%; max-width: 440px; }
    .brand { text-align: center; margin-bottom: 3rem; }
    .brand-icon { width: 56px; height: 56px; background: var(--accent); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1rem; box-shadow: 0 0 30px rgba(0,229,160,0.3); }
    .brand h1 { font-size: 2.2rem; letter-spacing: -1px; }
    .brand span { color: var(--accent); }
    .brand p { color: var(--muted); font-size: 0.9rem; margin-top: 0.3rem; }
    .role-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--surface2); padding: 4px; border-radius: 12px; margin-bottom: 2rem; }
    .role-tab { padding: 0.7rem; text-align: center; border-radius: 8px; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.85rem; letter-spacing: 0.5px; transition: all 0.2s; color: var(--muted); }
    .role-tab.active { background: var(--accent); color: #000; }
    .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; }
    .field { margin-bottom: 1.2rem; }
    .field label { display: block; font-size: 0.8rem; color: var(--muted); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 0.5rem; font-family: 'Syne', sans-serif; }
    .field input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem 1rem; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: border 0.2s; }
    .field input:focus { border-color: var(--accent); }
    .btn-primary { width: 100%; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .demo-hint { text-align: center; margin-top: 1rem; font-size: 0.8rem; color: var(--muted); }
    .demo-hint strong { color: var(--accent); }
    .error-msg { color: var(--danger); font-size: 0.82rem; text-align: center; margin-top: 0.75rem; }
  `]
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  role     = 'admin';
  username = 'admin';
  password = 'admin123';
  loading  = false;
  error    = '';

  setRole(r: string) {
    this.role     = r;
    this.username = r;
    this.password = r === 'admin' ? 'admin123' : 'student123';
    this.error    = '';
  }

  doLogin() {
    if (!this.username || !this.password) { this.error = 'Please fill all fields'; return; }
    this.loading = true;
    this.error   = '';
    this.auth.login(this.username, this.password).subscribe({
      next: res => {
        this.toast.show(`Welcome back, ${res.user.username}!`);
        this.router.navigate([res.user.role === 'admin' ? '/admin' : '/student']);
      },
      error: err => {
        this.error   = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
