import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FeeService }                from '../../../core/services/api.services';
import { AuthService }               from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>Fee Status</h2><p>Your hostel fee payment history</p></div>

    <div class="stats-grid">
      <div class="stat-card green">
        <div class="stat-label">Total Paid</div>
        <div class="stat-value green">₹{{ totalPaid | number }}</div>
        <div class="stat-sub">{{ paidCount }} months</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-label">Pending</div>
        <div class="stat-value orange">₹{{ totalPending | number }}</div>
        <div class="stat-sub">{{ pendingCount }} due</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Payment History</div></div>
      <table>
        <thead><tr><th>Month</th><th>Amount</th><th>Paid</th><th>Due Date</th><th>Paid On</th><th>Status</th></tr></thead>
        <tbody>
          @for (f of fees; track f._id) {
            <tr>
              <td><strong>{{ f.month }}</strong></td>
              <td>₹{{ f.amount | number }}</td>
              <td>₹{{ f.paidAmount | number }}</td>
              <td>{{ f.dueDate | date:'dd MMM yyyy' }}</td>
              <td>{{ f.paidDate ? (f.paidDate | date:'dd MMM yyyy') : '—' }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-green':  f.status === 'paid',
                  'badge-orange': f.status === 'partial',
                  'badge-red':    f.status === 'unpaid' || f.status === 'overdue'
                }">{{ f.status | titlecase }}</span>
              </td>
            </tr>
          }
          @if (fees.length === 0) {
            <tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem">No fee records found</td></tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class StudentFeesComponent implements OnInit {
  private feeSvc = inject(FeeService);
  private auth   = inject(AuthService);
  fees: any[] = [];

  get totalPaid()    { return this.fees.reduce((s, f) => s + f.paidAmount, 0); }
  get totalPending() { return this.fees.filter(f => f.status !== 'paid').reduce((s, f) => s + (f.amount - f.paidAmount), 0); }
  get paidCount()    { return this.fees.filter(f => f.status === 'paid').length; }
  get pendingCount() { return this.fees.filter(f => f.status !== 'paid').length; }

  ngOnInit() {
    const studentId = this.auth.currentUser()?.student?._id;
    if (studentId) {
      this.feeSvc.getByStudent(studentId).subscribe(f => this.fees = f);
    }
  }
}
