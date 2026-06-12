import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { MessService }               from '../../../core/services/api.services';

@Component({
  selector: 'app-student-mess',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>Mess Menu</h2><p>This week's meal schedule</p></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
      @for (m of menu; track m._id) {
        <div class="card" style="margin-bottom:0" [style.border-color]="m.day === today ? 'var(--accent)' : ''">
          <div class="card-header">
            <div class="card-title">🗓 {{ m.day }}</div>
            @if (m.day === today) { <span class="badge badge-green">Today</span> }
          </div>
          <div style="font-size:0.82rem">
            <div style="margin-bottom:0.5rem">
              <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">🌅 Breakfast</div>
              <div>{{ m.breakfast }}</div>
            </div>
            <div style="margin-bottom:0.5rem">
              <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">☀️ Lunch</div>
              <div>{{ m.lunch }}</div>
            </div>
            <div>
              <div style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">🌙 Dinner</div>
              <div>{{ m.dinner }}</div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class StudentMessComponent implements OnInit {
  private svc = inject(MessService);
  menu: any[] = [];
  today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  ngOnInit() { this.svc.getAll().subscribe(m => this.menu = m); }
}
