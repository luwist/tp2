import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@app/services';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';

@Component({
  imports: [ButtonModule, DialogModule],
  selector: 'app-session-expiring-dialog',
  styleUrl: './session-expiring-dialog.scss',
  templateUrl: './session-expiring-dialog.html',
})
export class SessionExpiringDialog {
  protected readonly session = inject(SessionService);

  protected readonly timeLeft = computed(() => {
    const total = this.session.secondsLeft();
    const minutes = Math.floor(total / 60);
    const seconds = String(total % 60).padStart(2, '0');

    return `${minutes}:${seconds}`;
  });

  onCancel() {
    this.session.logout();
  }
}
