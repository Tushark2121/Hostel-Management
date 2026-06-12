import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { NoticeService }             from '../../../core/services/api.services';

@Component({
  selector: 'app-student-notices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>Notice Board</h2><p>Important hostel announcements</p></div>
    @for (n of notices; track n._id) {
      <div class="notice" [ngClass]="n.type">
        <div class="notice-title">{{ n.title }}</div>
        <div class="notice-body">{{ n.body }}</div>
        <div class="notice-meta">
          📅 {{ n.createdAt | date:'dd MMM yyyy, h:mm a' }}
          <span class="badge" style="margin-left:0.5rem"
            [ngClass]="{'badge-red':n.type==='urgent','badge-blue':n.type==='info','badge-green':n.type==='general'}">
            {{ n.type }}
          </span>
        </div>
      </div>
    }
    @if (notices.length === 0) {
      <div class="card" style="text-align:center;color:var(--muted);padding:3rem">No notices yet.</div>
    }
  `
})
export class StudentNoticesComponent implements OnInit {
  private svc = inject(NoticeService);
  notices: any[] = [];
  ngOnInit() { this.svc.getAll().subscribe(n => this.notices = n); }
}


// ═══════════════════════════════════════════════════
// STUDENT VISITORS
// ═══════════════════════════════════════════════════
import { VisitorService } from '../../../core/services/api.services';

@Component({
  selector: 'app-student-visitors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>My Visitors</h2><p>Visitor log for your room</p></div>
    <div class="card">
      <table>
        <thead><tr><th>Visitor</th><th>Relation</th><th>Phone</th><th>In Time</th><th>Out Time</th><th>Status</th></tr></thead>
        <tbody>
          @for (v of visitors; track v._id) {
            <tr>
              <td><strong>{{ v.name }}</strong></td>
              <td>{{ v.relation }}</td>
              <td>{{ v.phone || '—' }}</td>
              <td>{{ v.inTime | date:'dd MMM, h:mm a' }}</td>
              <td>{{ v.outTime ? (v.outTime | date:'h:mm a') : '—' }}</td>
              <td>
                <span class="badge" [ngClass]="v.status==='out'?'badge-green':'badge-orange'">
                  {{ v.status === 'out' ? 'Exited' : 'Inside' }}
                </span>
              </td>
            </tr>
          }
          @if (visitors.length === 0) {
            <tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem">No visitors logged yet.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class StudentVisitorsComponent implements OnInit {
  private svc = inject(VisitorService);
  visitors: any[] = [];
  ngOnInit() { this.svc.getAll().subscribe(v => this.visitors = v); }
}
