import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h2>My Profile</h2>
      @if (student && !isEditing) {
        <button class="btn btn-primary" (click)="startEdit()" style="margin-left:auto">Edit Profile</button>
      }
    </div>

    @if (isEditing) {
      <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="card">
        <div class="card-header">
          <div class="card-title">Edit Profile</div>
        </div>
        <div style="padding:1.5rem">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
            <div>
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" formControlName="name" placeholder="Enter full name">
              @if (profileForm.get('name')?.invalid && profileForm.get('name')?.touched) {
                <div class="error-text">Name is required and must be at least 2 characters</div>
              }
            </div>
            <div>
              <label class="form-label">Email *</label>
              <input type="email" class="form-input" formControlName="email" placeholder="Enter email">
              @if (profileForm.get('email')?.invalid && profileForm.get('email')?.touched) {
                <div class="error-text">Please enter a valid email address</div>
              }
            </div>
            <div>
              <label class="form-label">Phone *</label>
              <input type="tel" class="form-input" formControlName="phone" placeholder="Enter phone number">
              @if (profileForm.get('phone')?.invalid && profileForm.get('phone')?.touched) {
                <div class="error-text">Phone number must be 10-15 characters</div>
              }
            </div>
            <div>
              <label class="form-label">Address *</label>
              <input type="text" class="form-input" formControlName="address" placeholder="Enter address">
              @if (profileForm.get('address')?.invalid && profileForm.get('address')?.touched) {
                <div class="error-text">Address is required</div>
              }
            </div>
            <div>
              <label class="form-label">Guardian Name</label>
              <input type="text" class="form-input" formControlName="guardianName" placeholder="Enter guardian name">
            </div>
            <div>
              <label class="form-label">Guardian Phone</label>
              <input type="tel" class="form-input" formControlName="guardianPhone" placeholder="Enter guardian phone">
              @if (profileForm.get('guardianPhone')?.invalid && profileForm.get('guardianPhone')?.touched) {
                <div class="error-text">Guardian phone must be 10-15 characters if provided</div>
              }
            </div>
          </div>
          <div style="display:flex;gap:1rem;justify-content:flex-end">
            <button type="button" class="btn btn-secondary" (click)="cancelEdit()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || saving">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </form>
    } @else if (student) {
      <div class="profile-hero">
        <div class="profile-avatar">{{ student.name[0] }}</div>
        <div class="profile-info">
          <h3>{{ student.name }}</h3>
          <div class="sub">{{ student.course }} — {{ student.year }}{{ ord(student.year) }} Year · Roll: {{ student.rollNumber }}</div>
          <div class="profile-tags">
            <span class="badge badge-blue">Room {{ student.room?.number || '—' }}</span>
            <span class="badge badge-green">{{ student.block || '—' }}</span>
            <span class="badge" [ngClass]="student.feeStatus==='paid'?'badge-green':student.feeStatus==='partial'?'badge-orange':'badge-red'">
              Fee: {{ student.feeStatus | titlecase }}
            </span>
            <span class="badge badge-green">{{ student.status | titlecase }}</span>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div class="card">
          <div class="card-header"><div class="card-title">Personal Details</div></div>
          <table>
            <tbody>
              <tr><td class="lbl">Student ID</td><td>{{ student.studentId }}</td></tr>
              <tr><td class="lbl">Full Name</td> <td>{{ student.name }}</td></tr>
              <tr><td class="lbl">Email</td>     <td>{{ student.email }}</td></tr>
              <tr><td class="lbl">Phone</td>     <td>{{ student.phone }}</td></tr>
              <tr><td class="lbl">Guardian</td>  <td>{{ student.guardian?.name }}</td></tr>
              <tr><td class="lbl">Guard. Ph.</td><td>{{ student.guardian?.phone }}</td></tr>
              <tr><td class="lbl">Address</td>   <td>{{ student.address }}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Hostel Stats</div></div>
          <div style="padding:0.5rem 0">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem">
              <div>
                <div style="font-size:0.75rem;color:var(--muted)">Check-in Date</div>
                <div style="font-size:1.1rem;font-weight:700;font-family:'Syne',sans-serif">{{ student.checkInDate | date:'MMM yyyy' }}</div>
              </div>
              <div>
                <div style="font-size:0.75rem;color:var(--muted)">Status</div>
                <div style="font-size:1.1rem;font-weight:700;font-family:'Syne',sans-serif">{{ student.status | titlecase }}</div>
              </div>
            </div>
            <div style="margin-bottom:0.8rem">
              <div style="font-size:0.75rem;color:var(--muted);margin-bottom:0.3rem">Fee Clearance</div>
              <div class="fee-bar">
                <div class="fee-fill" [ngClass]="student.feeStatus"
                  [style.width]="student.feeStatus==='paid'?'100%':student.feeStatus==='partial'?'50%':'100%'"></div>
              </div>
              <div style="font-size:0.72rem;margin-top:3px"
                [style.color]="student.feeStatus==='paid'?'var(--accent)':student.feeStatus==='partial'?'var(--warn)':'var(--danger)'">
                {{ student.feeStatus==='paid' ? '✓ Fully Paid' : student.feeStatus==='partial' ? '⚡ Partially Paid' : '✗ Unpaid' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div style="color:var(--muted);text-align:center;padding:4rem">Loading profile…</div>
    }
  `,
  styles: [`
    .lbl{color:var(--muted);font-size:0.82rem;width:120px;padding:0.6rem 0.8rem}
    .form-label { display:block; margin-bottom:0.5rem; font-size:0.85rem; font-weight:600; color:var(--text); }
    .form-input { width:100%; padding:0.75rem; border:1px solid var(--border); border-radius:8px; font-size:0.9rem; }
    .form-input:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px rgba(34,197,94,0.1); }
    .error-text { color: var(--danger); font-size: 0.75rem; margin-top: 0.25rem; }
  `]
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private studentSvc = inject(StudentService);
  private toastSvc = inject(ToastService);
  private fb = inject(FormBuilder);

  student: any = null;
  isEditing = false;
  saving = false;
  profileForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
    this.loadProfile();
  }

  private initializeForm() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,15}$/)]],
      address: ['', Validators.required],
      guardianName: [''],
      guardianPhone: ['', Validators.pattern(/^[0-9+\-\s()]{10,15}$/)]
    });
  }

  private loadProfile() {
    const user = this.auth.currentUser();
    if (user?.student?._id) {
      this.studentSvc.getById(user.student._id).subscribe(s => {
        this.student = s;
        this.profileForm.patchValue({
          name: s.name,
          email: s.email,
          phone: s.phone,
          address: s.address,
          guardianName: s.guardian?.name || '',
          guardianPhone: s.guardian?.phone || ''
        });
      });
    } else if (user?.student) {
      this.student = user.student;
      this.profileForm.patchValue({
        name: this.student.name,
        email: this.student.email,
        phone: this.student.phone,
        address: this.student.address,
        guardianName: this.student.guardian?.name || '',
        guardianPhone: this.student.guardian?.phone || ''
      });
    }
  }

  startEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadProfile(); // Reset form to original values
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving = true;
    const formData = this.profileForm.value;

    const updateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      guardian: {
        name: formData.guardianName,
        phone: formData.guardianPhone
      }
    };

    this.studentSvc.update(this.student._id, updateData).subscribe({
      next: (updatedStudent) => {
        this.student = updatedStudent;
        this.isEditing = false;
        this.saving = false;
        this.toastSvc.show('Profile updated successfully!', 'success');
        // Update auth service user data if needed
        const user = this.auth.currentUser();
        if (user?.student) {
          user.student = { ...user.student, ...updatedStudent };
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      error: (error) => {
        this.saving = false;
        this.toastSvc.show('Failed to update profile. Please try again.', 'error');
        console.error('Profile update error:', error);
      }
    });
  }

  ord(n: number) { return ['st','nd','rd'][n-1] || 'th'; }
}
