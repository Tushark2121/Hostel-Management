import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ToastService }      from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (ts.toast()) {
      <div class="toast" [class.show]="ts.toast()">
        <span class="toast-icon">
          {{ ts.toast()!.type === 'error' ? '❌' : ts.toast()!.type === 'info' ? 'ℹ️' : '✅' }}
        </span>
        {{ ts.toast()!.message }}
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed; bottom: 2rem; right: 2rem;
      background: var(--surface); border: 1px solid var(--accent);
      border-radius: 12px; padding: 0.8rem 1.2rem;
      font-size: 0.85rem; z-index: 9999;
      display: flex; align-items: center; gap: 0.6rem;
      animation: slideUp 0.3s ease;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    @keyframes slideUp {
      from { transform: translateY(40px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `]
})
export class ToastComponent {
  ts = inject(ToastService);
}
