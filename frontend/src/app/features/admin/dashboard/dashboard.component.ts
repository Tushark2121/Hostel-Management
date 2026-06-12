import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { RouterLink }                from '@angular/router';
import { DashboardService }          from '../../../core/services/api.services';
import { StatCardComponent }         from '../../../shared/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent],
  template: `
    <div class="page-header">
      <h2>Good Morning, Admin 👋</h2>
      <p>Here's what's happening at ResidenceX today</p>
    </div>

    @if (stats) {
      <div class="stats-grid">
        <app-stat-card color="green"  label="Total Students"   [value]="stats.totalStudents"  sub="Active residents" />
        <app-stat-card color="blue"   label="Rooms Occupied"   [value]="stats.occupiedRooms"  [sub]="'of ' + stats.totalRooms + ' total'" />
        <app-stat-card color="orange" label="Pending Fees"     [value]="'₹' + formatAmount(stats.pendingFees)" [sub]="stats.defaulterCount + ' students'" />
        <app-stat-card color="red"    label="Open Complaints"  [value]="stats.openComplaints" [sub]="stats.urgentComplaints + ' urgent'" />
      </div>

      <div class="quick-actions">
        <div class="quick-action" [routerLink]="'/admin/students'"><div class="qa-icon">👥</div><div class="qa-label">Students</div></div>
        <div class="quick-action" [routerLink]="'/admin/rooms'"><div class="qa-icon">🛏</div><div class="qa-label">Rooms</div></div>
        <div class="quick-action" [routerLink]="'/admin/notices'"><div class="qa-icon">📌</div><div class="qa-label">Notices</div></div>
        <div class="quick-action" [routerLink]="'/admin/fees'"><div class="qa-icon">💰</div><div class="qa-label">Fees</div></div>
        <div class="quick-action" [routerLink]="'/admin/visitors'"><div class="qa-icon">🚪</div><div class="qa-label">Visitors</div></div>
        <div class="quick-action" [routerLink]="'/admin/reports'"><div class="qa-icon">📊</div><div class="qa-label">Reports</div></div>
      </div>

      <div class="two-col">
        <div class="card">
          <div class="card-header"><div class="card-title">Occupancy by Block</div></div>
          @for (b of stats.blockOccupancy; track b.block) {
            <div class="chart-bar-row">
              <div class="chart-label">{{ b.block }}</div>
              <div class="chart-track"><div class="chart-fill" [style.width.%]="b.percent" [style.background]="blockColor($index)"></div></div>
              <div class="chart-val" [style.color]="blockColor($index)">{{ b.percent }}%</div>
            </div>
          }
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Recent Activity</div></div>
          <div class="timeline">
            <div class="tl-item"><div class="tl-dot"></div><div class="tl-time">Today, 9:15 AM</div><div class="tl-text">Room allotted to <strong>New Student</strong></div></div>
            <div class="tl-item"><div class="tl-dot"></div><div class="tl-time">Today, 8:40 AM</div><div class="tl-text">Fee payment received</div></div>
            <div class="tl-item"><div class="tl-dot"></div><div class="tl-time">Yesterday</div><div class="tl-text">Complaint resolved — Plumbing</div></div>
            <div class="tl-item"><div class="tl-dot" style="border-color:var(--danger)"></div><div class="tl-time">Yesterday</div><div class="tl-text">{{ stats.visitorsInside }} visitor(s) still inside</div></div>
          </div>
        </div>
      </div>
    } @else {
      <div class="loading">Loading dashboard…</div>
    }
  `,
  styles: [`
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .loading { color: var(--muted); text-align: center; padding: 4rem; }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  private dashSvc = inject(DashboardService);
  stats: any = null;

  ngOnInit() {
    this.dashSvc.getStats().subscribe(s => this.stats = s);
  }

  blockColor(i: number) {
    return ['var(--accent)', 'var(--accent2)', 'var(--warn)'][i] || 'var(--accent)';
  }

  formatAmount(n: number) {
    if (!n) return '0';
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
    if (n >= 1000)   return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  }
}
