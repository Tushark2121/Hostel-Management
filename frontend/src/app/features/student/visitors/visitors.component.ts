import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { VisitorService }            from '../../../core/services/api.services';

@Component({
  selector: 'app-student-visitors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>My Visitors</h2><p>Visitor log for your room</p></div>
    <div class="card">
      <table>
        <thead>
          <tr><th>Visitor</th><th>Relation</th><th>Phone</th><th>In Time</th><th>Out Time</th><th>Status</th></tr>
        </thead>
        <tbody>
          @for (v of visitors; track v._id) {
            <tr>
              <td><strong>{{ v.name }}</strong></td>
              <td>{{ v.relation }}</td>
              <td>{{ v.phone || '—' }}</td>
              <td>{{ v.inTime | date:'dd MMM, h:mm a' }}</td>
              <td>{{ v.outTime ? (v.outTime | date:'h:mm a') : '—' }}</td>
              <td>
                <span class="badge" [ngClass]="v.status === 'out' ? 'badge-green' : 'badge-orange'">
                  {{ v.status === 'out' ? 'Exited' : 'Inside' }}
                </span>
              </td>
            </tr>
          }
          @if (visitors.length === 0) {
            <tr>
              <td colspan="6" style="text-align:center;color:var(--muted);padding:2rem">No visitors logged yet.</td>
            </tr>
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
