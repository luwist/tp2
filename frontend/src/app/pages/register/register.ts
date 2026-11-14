import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';
import { Auth } from '@app/components/auth/auth';
import { InputMaskModule } from '@openng/optimus-ui/inputmask';
import { dateValidator } from '@app/validators/date.validator';
import { passwordMatchValidator } from '@app/validators/password-match.validator';
import { AvatarUploader } from '@app/components/ui';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { AuthService } from '@app/services/auth/auth.service';
import { RegisterRequestDTO } from '@app/dto/requests';

@Component({
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    TextareaModule,
    ToastModule,
    AvatarUploader,
    Auth,
  ],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  providers: [MessageService],
})
export class Register {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);

  protected readonly avatarPreviewUrl = signal<string | null>(null);
  protected readonly avatarError = signal<string | null>(null);

  isLoading = signal(false);

  form = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bio: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      birthDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, dateValidator],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      avatar: new FormControl<File | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator },
  );

  get passwordMismatch(): boolean {
    const confirm = this.form.get('confirmPassword');

    return !!this.form?.hasError('passwordMismatch') && !!(confirm?.touched || confirm?.dirty);
  }

  getFormControl(controlName: string) {
    return this.form.get(controlName);
  }

  onfileSelected(file: any) {
    this.form.patchValue({
      avatar: file,
    });
  }

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { avatar, ...rest } = this.form.getRawValue();

    if (!avatar) {
      return;
    }

    const data: RegisterRequestDTO = { ...rest, avatar };

    this.isLoading.set(true);

    this._authService.register(data).subscribe({
      next: () => this._router.navigateByUrl('/'),
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error',
        });
        this.isLoading.set(false);
      },
    });

    // this._authService.register(data).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     console.log('paso jeje');
    //     this._router.navigateByUrl('/');
    //   },
    //   error: (err) => {
    //     this._messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Ocurrio un error',
    //     });

    //     this.isLoading.set(false);
    //   },
    // });
  }
}
