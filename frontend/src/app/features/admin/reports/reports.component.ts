import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { DashboardService, FeeService } from '../../../core/services/api.services';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>Reports &amp; Analytics</h2><p>Hostel performance overview</p></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
      <div class="card">
        <div class="card-header"><div class="card-title">Block Occupancy</div></div>
        @if (stats) {
          @for (b of stats.blockOccupancy; track b.block) {
            <div class="chart-bar-row">
              <div class="chart-label">{{ b.block }}</div>
              <div class="chart-track"><div class="chart-fill" [style.width.%]="b.percent" [style.background]="blockColor($index)"></div></div>
              <div class="chart-val" [style.color]="blockColor($index)">{{ b.percent }}%</div>
            </div>
          }
        }
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Fee Collection Status</div></div>
        @if (feeSummary) {
          <div class="chart-bar-row">
            <div class="chart-label">Collected</div>
            <div class="chart-track"><div class="chart-fill" style="background:var(--accent)" [style.width.%]="feePercent"></div></div>
            <div class="chart-val" style="color:var(--accent)">{{ feePercent }}%</div>
          </div>
          <div class="chart-bar-row">
            <div class="chart-label">Pending</div>
            <div class="chart-track"><div class="chart-fill" style="background:var(--danger)" [style.width.%]="100 - feePercent"></div></div>
            <div class="chart-val" style="color:var(--danger)">{{ 100 - feePercent }}%</div>
          </div>
          <div style="margin-top:1rem;font-size:0.82rem;color:var(--muted)">
            Total Collected: <strong style="color:var(--accent)">₹{{ fmt(feeSummary.totalCollected) }}</strong> &nbsp;|&nbsp;
            Pending: <strong style="color:var(--danger)">₹{{ fmt(feeSummary.totalPending) }}</strong>
          </div>
        }
      </div>
    </div>

    @if (stats) {
      <div class="stats-grid">
        <div class="stat-card green"><div class="stat-label">Active Students</div><div class="stat-value green">{{ stats.totalStudents }}</div></div>
        <div class="stat-card blue"> <div class="stat-label">Rooms Occupied</div><div class="stat-value blue">{{ stats.occupiedRooms }}/{{ stats.totalRooms }}</div></div>
        <div class="stat-card orange"><div class="stat-label">Fee Defaulters</div><div class="stat-value orange">{{ stats.defaulterCount }}</div></div>
        <div class="stat-card red">  <div class="stat-label">Open Complaints</div><div class="stat-value red">{{ stats.openComplaints }}</div></div>
      </div>
    }
  `
})
export class ReportsComponent implements OnInit {
  dashSvc = inject(DashboardService); feeSvc = inject(FeeService);
  stats: any = null; feeSummary: any = null;
  get feePercent() {
    if (!this.feeSummary) return 0;
    const total = this.feeSummary.totalCollected + this.feeSummary.totalPending;
    return total ? Math.round((this.feeSummary.totalCollected / total) * 100) : 0;
  }
  ngOnInit() {
    this.dashSvc.getStats().subscribe(s => this.stats = s);
    this.feeSvc.getSummary().subscribe(s => this.feeSummary = s);
  }
  blockColor(i: number) { return ['var(--accent)','var(--accent2)','var(--warn)'][i]||'var(--accent)'; }
  fmt(n: number) { if (!n) return '0'; if (n>=100000) return (n/100000).toFixed(1)+'L'; if (n>=1000) return (n/1000).toFixed(1)+'K'; return n.toString(); }
}
