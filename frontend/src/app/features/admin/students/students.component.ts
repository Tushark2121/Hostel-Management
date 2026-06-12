import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { StudentService }            from '../../../core/services/student.service';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><h2>Students</h2><p>Manage all hostel residents</p></div>
      <button class="btn-sm btn-accent" (click)="openModal()">+ Add Student</button>
    </div>

    <div class="card" style="margin-bottom:1rem">
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <input type="text" placeholder="🔍  Search by name or ID…" [(ngModel)]="search"
          (ngModelChange)="loadStudents()" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.9rem;color:var(--text);font-size:0.85rem;outline:none;flex:1;min-width:200px">
        <select [(ngModel)]="blockFilter" (ngModelChange)="loadStudents()"
          style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.9rem;color:var(--text);font-size:0.85rem;outline:none">
          <option value="">All Blocks</option>
          <option>Block A</option><option>Block B</option><option>Block C</option>
        </select>
        <select [(ngModel)]="feeFilter" (ngModelChange)="loadStudents()"
          style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.9rem;color:var(--text);font-size:0.85rem;outline:none">
          <option value="">All Fee Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Room</th><th>Block</th><th>Phone</th><th>Fee Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for (s of students; track s._id) {
            <tr>
              <td style="color:var(--muted);font-size:0.8rem">{{ s.studentId }}</td>
              <td><strong>{{ s.name }}</strong><br><span style="color:var(--muted);font-size:0.78rem">{{ s.course }}</span></td>
              <td>{{ s.room?.number || '—' }}</td>
              <td>{{ s.block || '—' }}</td>
              <td>{{ s.phone }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-green': s.feeStatus === 'paid',
                  'badge-orange': s.feeStatus === 'partial',
                  'badge-red': s.feeStatus === 'unpaid'
                }">{{ s.feeStatus | titlecase }}</span>
              </td>
              <td>
                <button class="btn-sm btn-outline" style="margin-right:4px" (click)="editStudent(s)">Edit</button>
                <button class="btn-sm btn-danger" (click)="deleteStudent(s._id)">Del</button>
              </td>
            </tr>
          }
          @if (students.length === 0) {
            <tr><td colspan="7" style="text-align:center;color:var(--muted);padding:2rem">No students found</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- ADD/EDIT MODAL -->
    @if (showModal) {
      <div class="modal-overlay open" (click)="closeModal($event)">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editMode ? 'Edit Student' : 'Add New Student' }}</h3>
            <button class="close-btn" (click)="showModal = false">✕</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" [(ngModel)]="form.name" placeholder="Student name" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="form.email" placeholder="email@example.com" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" [(ngModel)]="form.phone" placeholder="+91 98765 43210" />
            </div>
            <div class="form-group">
              <label>Course</label>
              <input type="text" [(ngModel)]="form.course" placeholder="B.Tech CSE" />
            </div>
            <div class="form-group">
              <label>Year</label>
              <select [(ngModel)]="form.year">
                <option [ngValue]="1">1st Year</option>
                <option [ngValue]="2">2nd Year</option>
                <option [ngValue]="3">3rd Year</option>
                <option [ngValue]="4">4th Year</option>
              </select>
            </div>
            <div class="form-group">
              <label>Block</label>
              <select [(ngModel)]="form.block">
                <option value="">Select Block</option>
                <option>Block A</option><option>Block B</option><option>Block C</option>
              </select>
            </div>
            <div class="form-group">
              <label>Guardian Name</label>
              <input type="text" [(ngModel)]="form.guardianName" placeholder="Parent/Guardian name" />
            </div>
            <div class="form-group">
              <label>Guardian Phone</label>
              <input type="text" [(ngModel)]="form.guardianPhone" placeholder="+91 87654 32109" />
            </div>
            @if (!editMode) {
              <div class="form-group">
                <label>Login Username</label>
                <input type="text" [(ngModel)]="form.username" placeholder="student username" />
              </div>
              <div class="form-group">
                <label>Login Password</label>
                <input type="password" [(ngModel)]="form.password" placeholder="••••••••" />
              </div>
            }
          </div>
          <div class="form-actions">
            <button class="btn-sm btn-outline" (click)="showModal = false">Cancel</button>
            <button class="btn-sm btn-accent" (click)="saveStudent()">{{ editMode ? 'Update' : 'Add Student' }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; width: 90%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h3 { font-size: 1.1rem; }
    .close-btn { background: var(--surface2); border: none; color: var(--muted); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
  `]
})
export class StudentsComponent implements OnInit {
  private studentSvc = inject(StudentService);
  private toast      = inject(ToastService);

  students: any[] = [];
  search = ''; blockFilter = ''; feeFilter = '';
  showModal = false; editMode = false; editId = '';
  form: any = {};

  ngOnInit() { this.loadStudents(); }

  loadStudents() {
    this.studentSvc.getAll({ search: this.search, block: this.blockFilter, feeStatus: this.feeFilter })
      .subscribe(s => this.students = s);
  }

  openModal() {
    this.editMode = false;
    this.form = { name:'', email:'', phone:'', course:'', year:1, block:'', guardianName:'', guardianPhone:'', username:'', password:'' };
    this.showModal = true;
  }

  editStudent(s: any) {
    this.editMode = true; this.editId = s._id;
    this.form = { name: s.name, email: s.email, phone: s.phone, course: s.course, year: s.year, block: s.block, guardianName: s.guardian?.name, guardianPhone: s.guardian?.phone };
    this.showModal = true;
  }

  saveStudent() {
    const payload: any = { name: this.form.name, email: this.form.email, phone: this.form.phone, course: this.form.course, year: this.form.year, block: this.form.block, guardian: { name: this.form.guardianName, phone: this.form.guardianPhone } };
    if (!this.editMode) { payload.username = this.form.username; payload.password = this.form.password; }
    const req = this.editMode ? this.studentSvc.update(this.editId, payload) : this.studentSvc.create(payload);
    req.subscribe({
      next: () => { this.toast.show(this.editMode ? '✅ Student updated!' : '✅ Student added!'); this.showModal = false; this.loadStudents(); },
      error: e => this.toast.show(e.error?.message || 'Error', 'error')
    });
  }

  deleteStudent(id: string) {
    if (!confirm('Delete this student?')) return;
    this.studentSvc.delete(id).subscribe({ next: () => { this.toast.show('🗑 Student removed'); this.loadStudents(); }, error: e => this.toast.show(e.error?.message || 'Error', 'error') });
  }

  closeModal(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.showModal = false;
  }
}
