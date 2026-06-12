import { Component, Input, inject } from '@angular/core';
import { CommonModule }             from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService }              from '../../core/services/auth.service';

export interface NavItem {
  icon: string; label: string; route: string; badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <h2>Residence<span>X</span></h2>
        <div class="role-badge" [style.background]="role === 'admin' ? 'var(--warn)' : 'var(--accent2)'"
             [style.color]="'#fff'">
          {{ role === 'admin' ? 'ADMIN' : 'STUDENT' }}
        </div>
      </div>

      @for (section of sections; track section.label) {
        <div class="nav-section">
          <div class="nav-label">{{ section.label }}</div>
          @for (item of section.items; track item.route) {
            <a class="nav-item" [routerLink]="item.route" routerLinkActive="active">
              <div class="nav-icon">{{ item.icon }}</div>
              {{ item.label }}
              @if (item.badge) {
                <span class="nav-badge">{{ item.badge }}</span>
              }
            </a>
          }
        </div>
      }

      <div class="sidebar-footer">
        <div class="user-pill">
          <div class="avatar" [style.background]="role === 'admin' ? '#ff6b35' : 'var(--accent2)'">
            {{ (auth.currentUser()?.username || 'U')[0].toUpperCase() }}
          </div>
          <div class="user-info">
            <div class="name">{{ auth.currentUser()?.username }}</div>
            <div class="email">{{ auth.currentUser()?.email }}</div>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Out</button>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px; background: var(--surface); border-right: 1px solid var(--border);
      display: flex; flex-direction: column; padding: 1.5rem 0; flex-shrink: 0;
      overflow-y: auto; height: 100vh; position: sticky; top: 0;
    }
    .sidebar-brand { padding: 0 1.5rem 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1rem; }
    .sidebar-brand h2 { font-size: 1.2rem; letter-spacing: -0.5px; }
    .sidebar-brand span { color: var(--accent); }
    .role-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 700; display: inline-block; margin-top: 4px; }
    .nav-section { padding: 0 1rem; margin-bottom: 1rem; }
    .nav-label { font-size: 0.65rem; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; padding: 0 0.5rem; margin-bottom: 0.5rem; font-family: 'Syne', sans-serif; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.75rem; border-radius: 10px; cursor: pointer; transition: all 0.15s; color: var(--muted); font-size: 0.9rem; margin-bottom: 2px; text-decoration: none; }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active { background: rgba(0,229,160,0.1); color: var(--accent); }
    .nav-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
    .nav-badge { margin-left: auto; background: var(--danger); color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 20px; font-weight: 700; }
    .sidebar-footer { margin-top: auto; padding: 1rem 1.5rem 0; border-top: 1px solid var(--border); }
    .user-pill { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: #fff; flex-shrink: 0; }
    .user-info .name  { font-size: 0.85rem; font-weight: 600; }
    .user-info .email { font-size: 0.72rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
    .logout-btn { margin-left: auto; background: none; border: 1px solid var(--border); padding: 5px 10px; border-radius: 7px; color: var(--muted); font-size: 0.72rem; cursor: pointer; transition: all 0.2s; }
    .logout-btn:hover { border-color: var(--danger); color: var(--danger); }
  `]
})
export class SidebarComponent {
  @Input() role: 'admin' | 'student' = 'admin';
  @Input() sections: { label: string; items: NavItem[] }[] = [];
  auth = inject(AuthService);
}
