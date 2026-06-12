import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { ComplaintService }          from '../../../core/services/api.services';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-student-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><h2>My Complaints</h2><p>Raise and track issues</p></div>
      <button class="btn-sm btn-accent" (click)="openModal()">+ Raise Complaint</button>
    </div>

    @for (c of complaints; track c._id) {
      <div class="complaint-item">
        <div class="complaint-icon" style="background:var(--surface)">{{ catIcon(c.category) }}</div>
        <div style="flex:1">
          <div class="complaint-title">{{ c.title }}</div>
          <div class="complaint-meta">{{ c.complaintId }} · {{ c.category }} · {{ c.createdAt | date:'dd MMM yyyy' }}</div>
          @if (c.description) {
            <div style="font-size:0.8rem;color:var(--muted);margin-top:4px">{{ c.description }}</div>
          }
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem">
          <span class="badge" [ngClass]="{
            'badge-red':    c.status === 'open',
            'badge-orange': c.status === 'in-progress',
            'badge-green':  c.status === 'resolved'
          }">{{ c.status }}</span>
          <span class="badge badge-blue">{{ c.priority }}</span>
        </div>
      </div>
    }

    @if (complaints.length === 0) {
      <div class="card" style="text-align:center;color:var(--muted);padding:3rem">
        No complaints raised yet.
      </div>
    }

    @if (showModal) {
      <div class="modal-overlay open" (click)="closeOverlay($event)">
        <div class="modal">
          <div class="modal-header">
            <h3>Raise Complaint</h3>
            <button class="close-btn" (click)="showModal=false">✕</button>
          </div>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Title</label>
            <input type="text" [(ngModel)]="form.title" placeholder="Brief description of the issue" />
          </div>
          <div class="form-grid" style="margin-bottom:1rem">
            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="form.category">
                <option value="Plumbing">🔧 Plumbing</option>
                <option value="Electrical">⚡ Electrical</option>
                <option value="Cleanliness">🧹 Cleanliness</option>
                <option value="Wi-Fi">📶 Wi-Fi</option>
                <option value="Mess Food">🍽 Mess Food</option>
                <option value="Other">📋 Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select [(ngModel)]="form.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Description (optional)</label>
            <textarea [(ngModel)]="form.description" rows="3" placeholder="Provide more details…"></textarea>
          </div>
          <div class="form-actions">
            <button class="btn-sm btn-outline" (click)="showModal=false">Cancel</button>
            <button class="btn-sm btn-accent" (click)="submit()">Submit Complaint</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
    .modal{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2rem;width:90%;max-width:520px;max-height:90vh;overflow-y:auto}
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
    .close-btn{background:var(--surface2);border:none;color:var(--muted);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:1rem}
  `]
})
export class StudentComplaintsComponent implements OnInit {
  private svc   = inject(ComplaintService);
  private toast = inject(ToastService);
  complaints: any[] = [];
  showModal = false;
  form: any = { title: '', category: 'Plumbing', priority: 'medium', description: '' };

  ngOnInit() { this.load(); }
  load()     { this.svc.getAll().subscribe(c => this.complaints = c); }

  catIcon(cat: string) {
    const m: any = { Plumbing:'🔧', Electrical:'⚡', Cleanliness:'🧹', 'Wi-Fi':'📶', 'Mess Food':'🍽', Other:'📋' };
    return m[cat] || '📋';
  }

  openModal() {
    this.form = { title: '', category: 'Plumbing', priority: 'medium', description: '' };
    this.showModal = true;
  }

  submit() {
    if (!this.form.title) { this.toast.show('Please enter a title', 'error'); return; }
    this.svc.create(this.form).subscribe({
      next: () => { this.toast.show('⚠️ Complaint submitted!'); this.showModal = false; this.load(); },
      error: e  => this.toast.show(e.error?.message || 'Error', 'error')
    });
  }

  closeOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.showModal = false;
  }
}
