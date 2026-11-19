import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from '@openng/optimus-ui/avatar';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { TagModule } from '@openng/optimus-ui/tag';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';
import { CreateUser } from './create-user/create-user';
import { UserService } from '@app/services';
import { finalize } from 'rxjs';

@Component({
  imports: [
    AvatarModule,
    ButtonModule,
    FormsModule,
    TableModule,
    TagModule,
    ToggleSwitchModule,
    ToastModule,
    CreateUser,
  ],
  selector: 'app-users',
  styleUrl: './users.scss',
  templateUrl: './users.html',
  providers: [MessageService],
})
export class Users {
  protected readonly createDialogVisible = signal(false);

  private readonly _userService = inject(UserService);

  private readonly _messageService = inject(MessageService);

  protected readonly roleLabels: Record<any, string> = {
    admin: 'Administrador',
    user: 'Usuario',
  };

  protected readonly roleSeverities: Record<any, 'warn' | 'secondary'> = {
    admin: 'warn',
    user: 'secondary',
  };

  protected readonly users = signal<any[]>([]);

  ngOnInit() {
    this._userService.getAll().subscribe((data) => {
      this.users.set(data);
    });
  }

  protected getInitials(user: any): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  protected onCreateUser(): void {
    this.createDialogVisible.set(true);
  }

  protected onUserCreated(user: any): void {
    this.users.update((users) => [...users, user]);
  }

  protected onToggleEnabled(user: any, isActive: boolean): void {
    this.users.update((users) =>
      users.map((current) =>
        current._id === user._id ? { ...current, isActive } : current,
      ),
    );

    this._userService.setActive(user._id, isActive).subscribe({
      next: (updated) => {
        this.users.update((users) =>
          users.map((current) =>
            current._id === updated._id ? { ...current, ...updated } : current,
          ),
        );

        this._messageService.add({
          severity: 'success',
          summary: isActive ? 'Cuenta habilitada' : 'Cuenta deshabilitada',
          detail: `La cuenta de ${user.firstName} ${user.lastName} se ${
            isActive ? 'habilitó' : 'deshabilitó'
          } correctamente.`,
        });
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'No pudimos actualizar la cuenta',
          detail: 'Algo salió mal. Intentá de nuevo.',
        });

        this.users.update((users) =>
          users.map((current) =>
            current._id === user._id
              ? { ...current, isActive: !isActive }
              : current,
          ),
        );
      },
    });
  }
}
