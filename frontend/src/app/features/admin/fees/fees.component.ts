// ═══════════════════════════════════════════════════
// FEES COMPONENT
// ═══════════════════════════════════════════════════
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { FeeService }                from '../../../core/services/api.services';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Fees &amp; Payments</h2><p>Track and collect hostel fees</p></div>

    @if (summary) {
      <div class="stats-grid">
        <div class="stat-card green"><div class="stat-label">Collected</div><div class="stat-value green">₹{{ fmt(summary.totalCollected) }}</div></div>
        <div class="stat-card orange"><div class="stat-label">Pending</div><div class="stat-value orange">₹{{ fmt(summary.totalPending) }}</div></div>
        <div class="stat-card red"><div class="stat-label">Defaulters</div><div class="stat-value red">{{ summary.defaulters }}</div></div>
      </div>
    }

    <div class="card">
      <div class="card-header">
        <div class="card-title">Fee Records</div>
        <div style="display:flex;gap:0.5rem">
          <select [(ngModel)]="statusFilter" (ngModelChange)="loadFees()"
            style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.4rem 0.8rem;color:var(--text);font-size:0.82rem;outline:none">
            <option value="">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
          <button class="btn-sm btn-accent" (click)="toast.show('📧 Reminders sent!')">Send Reminders</button>
        </div>
      </div>
      <table>
        <thead><tr><th>Student</th><th>Month</th><th>Amount</th><th>Paid</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          @for (f of fees; track f._id) {
            <tr>
              <td><strong>{{ f.student?.name }}</strong><br><span style="color:var(--muted);font-size:0.76rem">{{ f.student?.studentId }}</span></td>
              <td>{{ f.month }}</td>
              <td>₹{{ f.amount | number }}</td>
              <td>₹{{ f.paidAmount | number }}</td>
              <td>{{ f.dueDate | date:'dd MMM yyyy' }}</td>
              <td><span class="badge" [ngClass]="{'badge-green': f.status==='paid','badge-orange': f.status==='partial','badge-red': f.status==='unpaid' || f.status==='overdue'}">{{ f.status }}</span></td>
              <td>
                @if (f.status !== 'paid') {
                  <button class="btn-sm btn-accent" (click)="collectFee(f)">Collect</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (showCollectModal) {
      <div class="modal-overlay open" (click)="closeOverlay($event)">
        <div class="modal">
          <div class="modal-header"><h3>Collect Fee</h3><button class="close-btn" (click)="showCollectModal=false">✕</button></div>
          <p style="color:var(--muted);margin-bottom:1rem">{{ selectedFee?.student?.name }} — {{ selectedFee?.month }}</p>
          <div class="form-group">
            <label>Amount (Outstanding: ₹{{ (selectedFee?.amount - selectedFee?.paidAmount) | number }})</label>
            <input type="number" [(ngModel)]="payAmount" [placeholder]="selectedFee?.amount - selectedFee?.paidAmount" />
          </div>
          <div class="form-actions">
            <button class="btn-sm btn-outline" (click)="showCollectModal=false">Cancel</button>
            <button class="btn-sm btn-accent" (click)="submitPayment()">Mark Paid</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px); }
    .modal { background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2rem;width:90%;max-width:440px; }
    .modal-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem; }
    .close-btn { background:var(--surface2);border:none;color:var(--muted);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:1rem; }
  `]
})
export class FeesComponent implements OnInit {
  feeSvc = inject(FeeService); toast = inject(ToastService);
  fees: any[] = []; summary: any = null;
  statusFilter = ''; showCollectModal = false; selectedFee: any = null; payAmount = 0;

  ngOnInit() { this.loadFees(); this.feeSvc.getSummary().subscribe(s => this.summary = s); }
  loadFees()  { this.feeSvc.getAll({ status: this.statusFilter }).subscribe(f => this.fees = f); }
  fmt(n: number) { if (!n) return '0'; if (n >= 100000) return (n/100000).toFixed(1)+'L'; if (n >= 1000) return (n/1000).toFixed(1)+'K'; return n.toString(); }
  collectFee(f: any) { this.selectedFee = f; this.payAmount = f.amount - f.paidAmount; this.showCollectModal = true; }
  submitPayment() {
    this.feeSvc.pay(this.selectedFee._id, this.payAmount).subscribe({ next: () => { this.toast.show('✅ Payment recorded!'); this.showCollectModal = false; this.loadFees(); this.feeSvc.getSummary().subscribe(s => this.summary = s); }, error: e => this.toast.show(e.error?.message || 'Error','error') });
  }
  closeOverlay(e: MouseEvent) { if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.showCollectModal = false; }
}
