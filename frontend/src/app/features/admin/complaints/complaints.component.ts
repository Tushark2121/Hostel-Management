import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { ComplaintService }          from '../../../core/services/api.services';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Complaints</h2><p>Resolve student issues</p></div>

    <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap">
      <select [(ngModel)]="statusFilter" (ngModelChange)="load()"
        style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.8rem;color:var(--text);font-size:0.85rem;outline:none">
        <option value="">All Status</option>
        <option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
      </select>
      <select [(ngModel)]="catFilter" (ngModelChange)="load()"
        style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.8rem;color:var(--text);font-size:0.85rem;outline:none">
        <option value="">All Categories</option>
        <option>Plumbing</option><option>Electrical</option><option>Cleanliness</option><option>Wi-Fi</option><option>Mess Food</option><option>Other</option>
      </select>
    </div>

    @for (c of complaints; track c._id) {
      <div class="complaint-item">
        <div class="complaint-icon" style="background:var(--surface)">{{ catIcon(c.category) }}</div>
        <div style="flex:1">
          <div class="complaint-title">{{ c.title }}</div>
          <div class="complaint-meta">{{ c.complaintId }} · {{ c.category }} · {{ c.createdAt | date:'dd MMM yyyy' }} · <strong>{{ c.student?.name }}</strong></div>
          @if (c.description) { <div style="font-size:0.8rem;color:var(--muted);margin-top:4px">{{ c.description }}</div> }
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem">
          <span class="badge" [ngClass]="{'badge-red':c.status==='open','badge-orange':c.status==='in-progress','badge-green':c.status==='resolved'}">{{ c.status }}</span>
          <span class="badge" [ngClass]="{'badge-red':c.priority==='urgent','badge-orange':c.priority==='high','badge-blue':c.priority==='medium'}">{{ c.priority }}</span>
          @if (c.status !== 'resolved') {
            <div style="display:flex;gap:4px;margin-top:4px">
              @if (c.status === 'open') { <button class="btn-sm btn-blue" (click)="updateStatus(c,'in-progress')">Start</button> }
              <button class="btn-sm btn-accent" (click)="updateStatus(c,'resolved')">Resolve</button>
            </div>
          }
        </div>
      </div>
    }
    @if (complaints.length === 0) {
      <div class="card" style="text-align:center;color:var(--muted);padding:3rem">No complaints found</div>
    }
  `
})
export class ComplaintsComponent implements OnInit {
  svc = inject(ComplaintService); toast = inject(ToastService);
  complaints: any[] = []; statusFilter = ''; catFilter = '';
  ngOnInit() { this.load(); }
  load() { this.svc.getAll({ status: this.statusFilter, category: this.catFilter }).subscribe(c => this.complaints = c); }
  catIcon(cat: string) { const m: any = { Plumbing:'🔧', Electrical:'⚡', Cleanliness:'🧹', 'Wi-Fi':'📶', 'Mess Food':'🍽', Other:'📋' }; return m[cat] || '📋'; }
  updateStatus(c: any, status: string) {
    this.svc.update(c._id, { status }).subscribe({ next: () => { this.toast.show('✅ Status updated'); this.load(); }, error: e => this.toast.show(e.error?.message || 'Error','error') });
  }
}
