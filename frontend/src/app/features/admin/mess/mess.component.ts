// ═══════════════════════════════════════════════════
// MESS COMPONENT
// ═══════════════════════════════════════════════════
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { MessService }               from '../../../core/services/api.services';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-mess',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Mess Menu</h2><p>Weekly meal schedule management</p></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
      @for (m of menu; track m._id) {
        <div class="card" style="margin-bottom:0">
          <div class="card-header">
            <div class="card-title">🗓 {{ m.day }}</div>
            <button class="btn-sm btn-outline" (click)="editItem(m)">Edit</button>
          </div>
          <div style="font-size:0.82rem">
            <div style="margin-bottom:0.5rem"><span style="color:var(--muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px">Breakfast</span><br>{{ m.breakfast }}</div>
            <div style="margin-bottom:0.5rem"><span style="color:var(--muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px">Lunch</span><br>{{ m.lunch }}</div>
            <div><span style="color:var(--muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px">Dinner</span><br>{{ m.dinner }}</div>
          </div>
        </div>
      }
    </div>

    @if (editingItem) {
      <div class="modal-overlay open" (click)="closeOverlay($event)">
        <div class="modal">
          <div class="modal-header"><h3>Edit {{ editingItem.day }} Menu</h3><button class="close-btn" (click)="editingItem=null">✕</button></div>
          <div class="form-group" style="margin-bottom:1rem"><label>Breakfast</label><textarea [(ngModel)]="editForm.breakfast" rows="2"></textarea></div>
          <div class="form-group" style="margin-bottom:1rem"><label>Lunch</label><textarea [(ngModel)]="editForm.lunch" rows="2"></textarea></div>
          <div class="form-group" style="margin-bottom:1rem"><label>Dinner</label><textarea [(ngModel)]="editForm.dinner" rows="2"></textarea></div>
          <div class="form-actions">
            <button class="btn-sm btn-outline" (click)="editingItem=null">Cancel</button>
            <button class="btn-sm btn-accent" (click)="saveItem()">Save</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
    .modal{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2rem;width:90%;max-width:480px}
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
    .close-btn{background:var(--surface2);border:none;color:var(--muted);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:1rem}
  `]
})
export class MessComponent implements OnInit {
  svc = inject(MessService); toast = inject(ToastService);
  menu: any[] = []; editingItem: any = null; editForm: any = {};
  ngOnInit() { this.load(); }
  load() { this.svc.getAll().subscribe(m => this.menu = m); }
  editItem(m: any) { this.editingItem = m; this.editForm = { breakfast: m.breakfast, lunch: m.lunch, dinner: m.dinner }; }
  saveItem() {
    this.svc.update(this.editingItem._id, this.editForm).subscribe({ next: () => { this.toast.show('✅ Menu updated!'); this.editingItem=null; this.load(); }, error: e => this.toast.show(e.error?.message||'Error','error') });
  }
  closeOverlay(e: MouseEvent) { if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.editingItem=null; }
}
