import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services';
import { PopoverModule } from '@openng/optimus-ui/popover';

@Component({
  imports: [PopoverModule],
  selector: 'app-user-menu',
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;

  protected logout(popover: any): void {
    popover.hide();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
