import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';
import { Auth } from '@app/components/auth/auth';
import { AuthService } from '@app/services/auth/auth.service';
import { AccountDisabled } from './account-disabled/account-disabled';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    ToastModule,
    Auth,
    AccountDisabled,
  ],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  providers: [MessageService],
})
export class Login {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);
  protected readonly disabledDialogVisible = signal(false);

  isLoading = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  getFormControl(controlName: string) {
    return this.form.get(controlName);
  }

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const data = this.form.getRawValue();

    this.form.markAsPending();

    this.isLoading.set(true);

    this._authService.login(data).subscribe({
      next: (data) => {
        console.log(data);

        this._router.navigateByUrl('/');
      },
      error: (err) => {
        console.log('ERRORRRR');
        console.log(err);
        if (err.error.code == 'ACCOUNT_DISABLED') {
          this.disabledDialogVisible.set(true);
        } else {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Credenciales incorrectas.',
          });
        }

        this.isLoading.set(false);
      },
    });
  }
}
