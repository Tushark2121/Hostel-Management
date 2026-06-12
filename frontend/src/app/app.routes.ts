import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'students',   loadComponent: () => import('./features/admin/students/students.component').then(m => m.StudentsComponent) },
      { path: 'rooms',      loadComponent: () => import('./features/admin/rooms/rooms.component').then(m => m.RoomsComponent) },
      { path: 'fees',       loadComponent: () => import('./features/admin/fees/fees.component').then(m => m.FeesComponent) },
      { path: 'complaints', loadComponent: () => import('./features/admin/complaints/complaints.component').then(m => m.ComplaintsComponent) },
      { path: 'notices',    loadComponent: () => import('./features/admin/notices/notices.component').then(m => m.NoticesComponent) },
      { path: 'visitors',   loadComponent: () => import('./features/admin/visitors/visitors.component').then(m => m.VisitorsComponent) },
      { path: 'mess',       loadComponent: () => import('./features/admin/mess/mess.component').then(m => m.MessComponent) },
      { path: 'reports',    loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent) },
    ]
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard('student')],
    loadComponent: () => import('./features/student/student-layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile',    loadComponent: () => import('./features/student/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'room',       loadComponent: () => import('./features/student/room/room.component').then(m => m.RoomComponent) },
      { path: 'fees',       loadComponent: () => import('./features/student/fees/fees.component').then(m => m.StudentFeesComponent) },
      { path: 'complaints', loadComponent: () => import('./features/student/complaints/complaints.component').then(m => m.StudentComplaintsComponent) },
      { path: 'notices',    loadComponent: () => import('./features/student/notices/notices.component').then(m => m.StudentNoticesComponent) },
      { path: 'mess',       loadComponent: () => import('./features/student/mess/mess.component').then(m => m.StudentMessComponent) },
      { path: 'visitors',   loadComponent: () => import('./features/student/visitors/visitors.component').then(m => m.StudentVisitorsComponent) },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
