import { effect, inject, Service, signal, untracked } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

const WARNING_BEFORE_EXPIRY_MS = 30 * 1000;

@Service()
export class SessionService {
  readonly expiringDialogVisible = signal(false);
  readonly isExtending = signal(false);
  readonly secondsLeft = signal(0);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private countdownInterval?: ReturnType<typeof setInterval>;
  private expiresAt = 0;
  private expiryTimeout?: ReturnType<typeof setTimeout>;
  private warningTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const token = this.authService.token();

      console.log('TOKENSITO');
      console.log(token);
      console.log('TOKENSITO');

      untracked(() => (token ? this.start(token) : this.stop()));
    });
  }

  extend(): void {
    this.isExtending.set(true);

    this.authService
      .refreshToken()
      .pipe(finalize(() => this.isExtending.set(false)))
      .subscribe({
        error: () => this.expire(),
      });
  }

  async logout() {
    this.authService.logout();

    await this.router.navigate(['/login']);
  }

  private expire(): void {
    this.authService.logout();
    this.router.navigate(['/login']);

    this.expiringDialogVisible.set(false);
  }

  private getExpiration(token: string): number | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private showWarning(): void {
    console.log('MOSTRAR WARNINGGGGG');
    this.updateSecondsLeft();
    this.expiringDialogVisible.set(true);
    this.countdownInterval = setInterval(() => this.updateSecondsLeft(), 1000);
  }

  private start(token: string): void {
    this.stop();

    const expiresAt = this.getExpiration(token);
    if (!expiresAt) return;

    const timeToExpire = expiresAt - Date.now();
    if (timeToExpire <= 0) return;

    this.expiresAt = expiresAt;

    const timeToWarning = timeToExpire - WARNING_BEFORE_EXPIRY_MS;

    this.expiryTimeout = setTimeout(() => this.expire(), timeToExpire);

    if (timeToWarning <= 0) {
      this.showWarning();
    } else {
      this.warningTimeout = setTimeout(() => this.showWarning(), timeToWarning);
    }
  }

  private stop(): void {
    clearTimeout(this.warningTimeout);
    clearTimeout(this.expiryTimeout);
    clearInterval(this.countdownInterval);

    this.expiringDialogVisible.set(false);
    this.secondsLeft.set(0);
  }

  private updateSecondsLeft(): void {
    this.secondsLeft.set(Math.max(Math.ceil((this.expiresAt - Date.now()) / 1000), 0));
  }
}
