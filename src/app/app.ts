import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  template: `
    <router-outlet></router-outlet> <!-- Hiển thị component theo route -->
    <p-toast /> <!-- Hiển thị toast messages (của PrimeNG) -->
  `,
})
export class AppComponent {}