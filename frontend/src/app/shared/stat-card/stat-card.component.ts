import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [ngClass]="color">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value" [ngClass]="color">{{ value }}</div>
      <div class="stat-sub">{{ sub }}</div>
    </div>
  `,
  styles: [`
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; position: relative; overflow: hidden; }
    .stat-card::before { content: ''; position: absolute; top: 0; right: 0; width: 80px; height: 80px; border-radius: 50%; opacity: 0.08; transform: translate(20px, -20px); }
    .stat-card.green::before { background: var(--accent); }
    .stat-card.blue::before  { background: var(--accent2); }
    .stat-card.orange::before{ background: var(--warn); }
    .stat-card.red::before   { background: var(--danger); }
    .stat-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-family: 'Syne', sans-serif; }
    .stat-value { font-size: 2.2rem; font-family: 'Syne', sans-serif; font-weight: 800; margin: 0.3rem 0; }
    .stat-value.green  { color: var(--accent); }
    .stat-value.blue   { color: var(--accent2); }
    .stat-value.orange { color: var(--warn); }
    .stat-value.red    { color: var(--danger); }
    .stat-sub { font-size: 0.78rem; color: var(--muted); }
  `],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { '[style.display]': '"contents"' }
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() sub   = '';
  @Input() color: 'green' | 'blue' | 'orange' | 'red' = 'green';
}
