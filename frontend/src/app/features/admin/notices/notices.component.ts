import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { NoticeService }             from '../../../core/services/api.services';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><h2>Notice Board</h2><p>Post &amp; manage announcements</p></div>
      <button class="btn-sm btn-accent" (click)="openModal()">+ Post Notice</button>
    </div>

    @for (n of notices; track n._id) {
      <div class="notice" [ngClass]="n.type">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="notice-title">{{ n.title }}</div>
          <button class="btn-sm btn-danger" style="font-size:0.7rem;padding:2px 8px" (click)="delete(n._id)">Delete</button>
        </div>
        <div class="notice-body">{{ n.body }}</div>
        <div class="notice-meta">📅 {{ n.createdAt | date:'dd MMM yyyy, h:mm a' }} · <span class="badge" [ngClass]="{'badge-red':n.type==='urgent','badge-blue':n.type==='info','badge-green':n.type==='general'}">{{ n.type }}</span></div>
      </div>
    }

    @if (showModal) {
      <div class="modal-overlay open" (click)="closeOverlay($event)">
        <div class="modal">
          <div class="modal-header"><h3>Post Notice</h3><button class="close-btn" (click)="showModal=false">✕</button></div>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Title</label>
            <input type="text" [(ngModel)]="form.title" placeholder="Notice title" />
          </div>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Body</label>
            <textarea [(ngModel)]="form.body" placeholder="Notice content…" rows="4"></textarea>
          </div>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Type</label>
            <select [(ngModel)]="form.type">
              <option value="general">General</option>
              <option value="urgent">Urgent</option>
              <option value="info">Info</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn-sm btn-outline" (click)="showModal=false">Cancel</button>
            <button class="btn-sm btn-accent" (click)="post()">Post Notice</button>
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
export class NoticesComponent implements OnInit {
  svc = inject(NoticeService); toast = inject(ToastService);
  notices: any[] = []; showModal = false; form: any = { title:'', body:'', type:'general' };
  ngOnInit() { this.load(); }
  load() { this.svc.getAll().subscribe(n => this.notices = n); }
  openModal() { this.form = { title:'', body:'', type:'general' }; this.showModal = true; }
  post() {
    if (!this.form.title || !this.form.body) { this.toast.show('Fill all fields','error'); return; }
    this.svc.create(this.form).subscribe({ next: () => { this.toast.show('📌 Notice posted!'); this.showModal=false; this.load(); }, error: e => this.toast.show(e.error?.message||'Error','error') });
  }
  delete(id: string) {
    if (!confirm('Delete notice?')) return;
    this.svc.delete(id).subscribe({ next: () => { this.toast.show('🗑 Notice deleted'); this.load(); }, error: e => this.toast.show(e.error?.message||'Error','error') });
  }
  closeOverlay(e: MouseEvent) { if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.showModal=false; }
}
