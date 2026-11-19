import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from '@openng/optimus-ui/avatar';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CreatePost } from './create-post/create-post';
import { UserMenu } from './user-menu/user-menu';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  imports: [RouterLink, ButtonModule, AvatarModule, CreatePost, UserMenu],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly user = this.auth.currentUser;
  readonly createDialogVisible = signal(false);

  protected readonly menuItems: any[] = [
    { label: 'Mi perfil', icon: 'pi pi-user', routerLink: '/profile' },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.auth.logout() },
  ];
}
