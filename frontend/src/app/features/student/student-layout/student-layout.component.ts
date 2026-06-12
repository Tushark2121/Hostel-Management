import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar role="student" [sections]="navSections" />
      <main class="main fade-in">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`.app-layout{display:flex;height:100vh} .main{flex:1;overflow-y:auto;padding:2rem;background:var(--bg)}`]
})
export class StudentLayoutComponent {
  navSections = [
    { label: 'My Account', items: [
      { icon: '👤', label: 'My Profile',   route: '/student/profile' },
      { icon: '🛏', label: 'My Room',      route: '/student/room' },
      { icon: '💳', label: 'Fee Status',   route: '/student/fees' },
      { icon: '⚠️', label: 'Complaints',  route: '/student/complaints' },
    ]},
    { label: 'Campus', items: [
      { icon: '📌', label: 'Notice Board', route: '/student/notices' },
      { icon: '🍽', label: 'Mess Menu',    route: '/student/mess' },
      { icon: '🚪', label: 'My Visitors',  route: '/student/visitors' },
    ]}
  ];
}
