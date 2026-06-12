import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar role="admin" [sections]="navSections" />
      <main class="main fade-in">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; }
    .main { flex: 1; overflow-y: auto; padding: 2rem; background: var(--bg); }
  `]
})
export class AdminLayoutComponent {
  navSections = [
    {
      label: 'Main',
      items: [
        { icon: '📊', label: 'Dashboard',    route: '/admin/dashboard' },
        { icon: '👥', label: 'Students',     route: '/admin/students' },
        { icon: '🛏', label: 'Rooms',        route: '/admin/rooms' },
        { icon: '💳', label: 'Fees',         route: '/admin/fees' },
      ]
    },
    {
      label: 'Operations',
      items: [
        { icon: '⚠️', label: 'Complaints',  route: '/admin/complaints' },
        { icon: '📌', label: 'Notice Board', route: '/admin/notices' },
        { icon: '🚪', label: 'Visitor Log',  route: '/admin/visitors' },
        { icon: '🍽', label: 'Mess Menu',    route: '/admin/mess' },
        { icon: '📈', label: 'Reports',      route: '/admin/reports' },
      ]
    }
  ];
}
