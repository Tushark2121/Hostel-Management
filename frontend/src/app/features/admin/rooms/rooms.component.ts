import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { RoomService }               from '../../../core/services/api.services';
import { StudentService }            from '../../../core/services/student.service';
import { ToastService }              from '../../../core/services/toast.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Room Management</h2><p>View &amp; allot rooms across all blocks</p></div>

    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div class="stat-card green"><div class="stat-label">Available</div><div class="stat-value green">{{ countByStatus('available') }}</div></div>
      <div class="stat-card red">  <div class="stat-label">Full</div>     <div class="stat-value red">{{ countByStatus('full') }}</div></div>
      <div class="stat-card orange"><div class="stat-label">Partial</div> <div class="stat-value orange">{{ countByStatus('partial') }}</div></div>
      <div class="stat-card blue"> <div class="stat-label">Maintenance</div><div class="stat-value blue">{{ countByStatus('maintenance') }}</div></div>
    </div>

    <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap">
      <select [(ngModel)]="blockFilter" (ngModelChange)="loadRooms()"
        style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.9rem;color:var(--text);outline:none">
        <option value="">All Blocks</option>
        <option>Block A</option><option>Block B</option><option>Block C</option>
      </select>
      <select [(ngModel)]="statusFilter" (ngModelChange)="loadRooms()"
        style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.9rem;color:var(--text);outline:none">
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="partial">Partial</option>
        <option value="full">Full</option>
      </select>
      <button class="btn-sm btn-accent" (click)="openAllotModal()">Allot Room</button>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Room Grid</div></div>
      <div class="room-grid">
        @for (room of rooms; track room._id) {
          <div class="room-card" [ngClass]="{ full: room.status === 'full' }" (click)="selectRoom(room)">
            <div class="room-number">{{ room.number }}</div>
            <div class="room-type">{{ room.type }} · {{ room.block }}</div>
            <div class="room-occupancy">
              <span class="room-dot" [ngClass]="{
                'dot-green': room.status === 'available',
                'dot-red': room.status === 'full',
                'dot-orange': room.status === 'partial'
              }"></span>
              {{ room.occupants.length }}/{{ room.capacity }}
            </div>
          </div>
        }
      </div>
    </div>

    <!-- ROOM DETAIL MODAL -->
    @if (selectedRoom) {
      <div class="modal-overlay open" (click)="closeOverlay($event)">
        <div class="modal">
          <div class="modal-header">
            <h3>Room {{ selectedRoom.number }} · {{ selectedRoom.block }}</h3>
            <button class="close-btn" (click)="selectedRoom = null">✕</button>
          </div>
          <p style="color:var(--muted);font-size:0.85rem;margin-bottom:1rem">{{ selectedRoom.type }} · Capacity: {{ selectedRoom.capacity }} · ₹{{ selectedRoom.monthlyRent }}/month</p>
          <div class="card-title" style="margin-bottom:0.75rem">Occupants</div>
          @for (occ of selectedRoom.occupants; track occ._id) {
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border)">
              <span>{{ occ.name }} <span style="color:var(--muted);font-size:0.78rem">({{ occ.studentId }})</span></span>
              <button class="btn-sm btn-danger" (click)="vacate(selectedRoom._id, occ._id)">Vacate</button>
            </div>
          }
          @if (selectedRoom.occupants.length === 0) {
            <p style="color:var(--muted);font-size:0.85rem">No occupants</p>
          }
        </div>
      </div>
    }

    <!-- ALLOT MODAL -->
    @if (showAllotModal) {
      <div class="modal-overlay open" (click)="closeOverlay($event)">
        <div class="modal">
          <div class="modal-header"><h3>Allot Room</h3><button class="close-btn" (click)="showAllotModal = false">✕</button></div>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Select Room</label>
            <select [(ngModel)]="allotRoomId">
              <option value="">Choose room…</option>
              @for (r of availableRooms; track r._id) {
                <option [value]="r._id">{{ r.number }} ({{ r.block }}) — {{ r.occupants.length }}/{{ r.capacity }}</option>
              }
            </select>
          </div>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Select Student</label>
            <select [(ngModel)]="allotStudentId">
              <option value="">Choose student…</option>
              @for (s of allStudents; track s._id) {
                <option [value]="s._id">{{ s.name }} ({{ s.studentId }})</option>
              }
            </select>
          </div>
          <div class="form-actions">
            <button class="btn-sm btn-outline" (click)="showAllotModal = false">Cancel</button>
            <button class="btn-sm btn-accent" (click)="allotRoom()">Allot</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; width: 90%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .close-btn { background: var(--surface2); border: none; color: var(--muted); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
  `]
})
export class RoomsComponent implements OnInit {
  private roomSvc    = inject(RoomService);
  private studentSvc = inject(StudentService);
  private toast      = inject(ToastService);

  rooms: any[] = []; allStudents: any[] = [];
  blockFilter = ''; statusFilter = '';
  selectedRoom: any = null;
  showAllotModal = false; allotRoomId = ''; allotStudentId = '';

  ngOnInit() { this.loadRooms(); this.studentSvc.getAll().subscribe(s => this.allStudents = s); }

  loadRooms() {
    this.roomSvc.getAll({ block: this.blockFilter, status: this.statusFilter })
      .subscribe(r => this.rooms = r);
  }

  countByStatus(status: string) { return this.rooms.filter(r => r.status === status).length; }
  get availableRooms()          { return this.rooms.filter(r => r.status !== 'full'); }

  selectRoom(room: any)         { this.selectedRoom = room; }
  openAllotModal()              { this.showAllotModal = true; this.allotRoomId = ''; this.allotStudentId = ''; }

  allotRoom() {
    if (!this.allotRoomId || !this.allotStudentId) { this.toast.show('Select room and student', 'error'); return; }
    this.roomSvc.allot(this.allotRoomId, this.allotStudentId).subscribe({
      next: () => { this.toast.show('✅ Room allotted!'); this.showAllotModal = false; this.loadRooms(); },
      error: e => this.toast.show(e.error?.message || 'Error', 'error')
    });
  }

  vacate(roomId: string, studentId: string) {
    if (!confirm('Vacate this student from the room?')) return;
    this.roomSvc.vacate(roomId, studentId).subscribe({
      next: () => { this.toast.show('✅ Student vacated'); this.selectedRoom = null; this.loadRooms(); },
      error: e => this.toast.show(e.error?.message || 'Error', 'error')
    });
  }

  closeOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.selectedRoom = null; this.showAllotModal = false;
    }
  }
}
