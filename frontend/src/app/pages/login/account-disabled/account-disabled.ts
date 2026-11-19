import { Component, model, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';

@Component({
  imports: [ButtonModule, DialogModule],
  selector: 'app-account-disabled',
  styleUrl: './account-disabled.scss',
  templateUrl: './account-disabled.html',
})
export class AccountDisabled {
  readonly closed = output<void>();
  readonly visible = model(false);

  protected close(): void {
    this.visible.set(false);
  }
}
