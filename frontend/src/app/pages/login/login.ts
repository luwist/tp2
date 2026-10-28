import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';
import { Auth } from '@app/components/auth/auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink, InputTextModule, ButtonModule, ToastModule, Auth],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  providers: [MessageService],
})
export class Login {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);

  isLoading = signal(false);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  getFormControl(controlName: string) {
    return this.form.get(controlName);
  }

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { email, password } = this.form.getRawValue();

    this.form.markAsPending();

    this.isLoading.set(true);

    this._authService
      .login({
        email: email,
        password: password,
      })
      .subscribe({
        next: (data) => {
          this._router.navigateByUrl('/');
        },
        error: (err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Credenciales incorrectas.',
          });

          this.isLoading.set(false);
        },
      });
  }
}
