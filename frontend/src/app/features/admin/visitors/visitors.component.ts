import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { VisitorService }            from '../../../core/services/api.services';
import { StudentService }            from '../../../core/services/student.service';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><h2>Visitor Log</h2><p>Track all hostel visitors</p></div>
      <button class="btn-sm btn-accent" (click)="openModal()">+ Log Visitor</button>
    </div>

    <div class="card">
      <table>
        <thead><tr><th>Visitor</th><th>Relation</th><th>Student</th><th>In Time</th><th>Out Time</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          @for (v of visitors; track v._id) {
            <tr>
              <td><strong>{{ v.name }}</strong></td>
              <td>{{ v.relation }}</td>
              <td>{{ v.student?.name }}</td>
              <td>{{ v.inTime | date:'dd MMM, h:mm a' }}</td>
              <td>{{ v.outTime ? (v.outTime | date:'h:mm a') : '—' }}</td>
              <td><span class="badge" [ngClass]="v.status==='out'?'badge-green':'badge-orange'">{{ v.status==='out'?'Exited':'Inside' }}</span></td>
              <td>
                @if (v.status === 'inside') {
                  <button class="btn-sm btn-blue" (click)="checkout(v._id)">Check Out</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (showModal) {
      <div class="modal-overlay open" (click)="closeOverlay($event)">
        <div class="modal">
          <div class="modal-header"><h3>Log Visitor</h3><button class="close-btn" (click)="showModal=false">✕</button></div>
          <div class="form-grid">
            <div class="form-group"><label>Visitor Name</label><input type="text" [(ngModel)]="form.name" placeholder="Full name" /></div>
            <div class="form-group"><label>Relation</label><input type="text" [(ngModel)]="form.relation" placeholder="Mother / Father / Friend…" /></div>
            <div class="form-group"><label>Phone</label><input type="text" [(ngModel)]="form.phone" placeholder="+91…" /></div>
            <div class="form-group">
              <label>Student</label>
              <select [(ngModel)]="form.student">
                <option value="">Select student…</option>
                @for (s of students; track s._id) { <option [value]="s._id">{{ s.name }} ({{ s.studentId }})</option> }
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-sm btn-outline" (click)="showModal=false">Cancel</button>
            <button class="btn-sm btn-accent" (click)="logVisitor()">Log Visitor</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
    .modal{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2rem;width:90%;max-width:520px}
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
    .close-btn{background:var(--surface2);border:none;color:var(--muted);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:1rem}
  `]
})
export class VisitorsComponent implements OnInit {
  svc = inject(VisitorService); studentSvc = inject(StudentService); toast = inject(ToastService);
  visitors: any[] = []; students: any[] = [];
  showModal = false; form: any = {};
  ngOnInit() { this.load(); this.studentSvc.getAll().subscribe(s => this.students = s); }
  load() { this.svc.getAll().subscribe(v => this.visitors = v); }
  openModal() { this.form = { name:'', relation:'', phone:'', student:'' }; this.showModal = true; }
  logVisitor() {
    if (!this.form.name || !this.form.student) { this.toast.show('Fill required fields','error'); return; }
    this.svc.create(this.form).subscribe({ next: () => { this.toast.show('✅ Visitor logged!'); this.showModal=false; this.load(); }, error: e => this.toast.show(e.error?.message||'Error','error') });
  }
  checkout(id: string) {
    this.svc.checkout(id).subscribe({ next: () => { this.toast.show('✅ Visitor checked out'); this.load(); }, error: e => this.toast.show(e.error?.message||'Error','error') });
  }
  closeOverlay(e: MouseEvent) { if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.showModal=false; }
}
