import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { AuthService }               from '../../../core/services/auth.service';
import { RoomService }               from '../../../core/services/api.services';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>My Room</h2><p>Your room details and roommates</p></div>

    @if (room) {
      <div class="profile-hero" style="margin-bottom:1.5rem">
        <div class="profile-avatar" style="font-size:2.5rem;background:var(--accent);color:#000">🛏</div>
        <div class="profile-info">
          <h3>Room {{ room.number }}</h3>
          <div class="sub">{{ room.block }} · Floor {{ room.floor }} · {{ room.type }}</div>
          <div class="profile-tags">
            <span class="badge badge-blue">{{ room.type }}</span>
            <span class="badge" [ngClass]="{
              'badge-green':  room.status === 'available',
              'badge-orange': room.status === 'partial',
              'badge-red':    room.status === 'full'
            }">{{ room.status | titlecase }}</span>
            <span class="badge badge-gold">₹{{ room.monthlyRent | number }}/mo</span>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div class="card">
          <div class="card-header"><div class="card-title">Room Details</div></div>
          <table>
            <tbody>
              <tr><td class="lbl">Room No.</td>   <td>{{ room.number }}</td></tr>
              <tr><td class="lbl">Block</td>       <td>{{ room.block }}</td></tr>
              <tr><td class="lbl">Floor</td>       <td>{{ room.floor }}</td></tr>
              <tr><td class="lbl">Type</td>        <td>{{ room.type }}</td></tr>
              <tr><td class="lbl">Capacity</td>    <td>{{ room.capacity }}</td></tr>
              <tr><td class="lbl">Occupants</td>   <td>{{ room.occupants?.length }}</td></tr>
              <tr><td class="lbl">Monthly Rent</td><td>₹{{ room.monthlyRent | number }}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Roommates</div></div>
          @for (occ of room.occupants; track occ._id) {
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0;border-bottom:1px solid var(--border)">
              <div style="width:36px;height:36px;border-radius:50%;background:var(--accent2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:#fff;flex-shrink:0">
                {{ occ.name[0] }}
              </div>
              <div>
                <div style="font-size:0.88rem;font-weight:600">{{ occ.name }}</div>
                <div style="font-size:0.76rem;color:var(--muted)">{{ occ.studentId }}</div>
              </div>
            </div>
          }
          @if (!room.occupants?.length) {
            <p style="color:var(--muted);font-size:0.85rem">No other occupants</p>
          }
        </div>
      </div>

      @if (room.amenities?.length) {
        <div class="card">
          <div class="card-header"><div class="card-title">Amenities</div></div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            @for (a of room.amenities; track a) {
              <span class="badge badge-blue">{{ a }}</span>
            }
          </div>
        </div>
      }
    } @else {
      <div class="card" style="text-align:center;padding:3rem;color:var(--muted)">
        No room assigned yet. Please contact the hostel admin.
      </div>
    }
  `,
  styles: [`.lbl{color:var(--muted);font-size:0.82rem;width:130px;padding:0.6rem 0.8rem}`]
})
export class RoomComponent implements OnInit {
  private auth    = inject(AuthService);
  private roomSvc = inject(RoomService);
  room: any = null;

  ngOnInit() {
    const user = this.auth.currentUser();
    const roomId = user?.student?.room;
    if (roomId) {
      this.roomSvc.getById(typeof roomId === 'object' ? roomId._id : roomId)
        .subscribe(r => this.room = r);
    }
  }
}
