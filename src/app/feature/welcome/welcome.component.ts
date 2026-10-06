import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {}