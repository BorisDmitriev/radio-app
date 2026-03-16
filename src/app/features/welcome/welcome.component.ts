import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  listenerName = '';
  moderatorUsername = '';
  moderatorPassword = '';
  moderatorError = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  continueAsListener(): void {
    const success = this.authService.loginAsListener(this.listenerName);

    if (success) {
      this.router.navigate(['/now-playing']);
    }
  }

  loginAsModerator(): void {
    const success = this.authService.loginAsModerator(
      this.moderatorUsername,
      this.moderatorPassword
    );

    this.moderatorError = !success;

    if (success) {
      this.router.navigate(['/moderator-dashboard']);
    }
  }
}
