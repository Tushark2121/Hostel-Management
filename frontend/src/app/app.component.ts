import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { injectSpeedInsights } from '@vercel/speed-insights';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `<router-outlet /><app-toast />`
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Initialize Vercel Speed Insights
    injectSpeedInsights();
  }
}
