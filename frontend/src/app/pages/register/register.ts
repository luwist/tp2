import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';
import { Auth } from '@app/components/auth/auth';
import { InputMaskModule } from '@openng/optimus-ui/inputmask';
import { dateValidator } from '@app/validators/date.validator';
import { passwordMatchValidator } from '@app/validators/password-match.validator';

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    ToastModule,
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

  private avatarFile: File | null = null;

  protected readonly avatarPreviewUrl = signal<string | null>(null);
  protected readonly avatarError = signal<string | null>(null);

  isLoading = signal(false);

  form = new FormGroup(
    {
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      bio: new FormControl('', Validators.required),
      birthDate: new FormControl('', [Validators.required, dateValidator]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
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

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      this.avatarError.set('Elegí una imagen JPG, PNG o WebP.');
      input.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      this.avatarError.set('La imagen no puede pesar más de 2 MB.');
      input.value = '';
      return;
    }

    this.revokeAvatarPreview();
    this.avatarFile = file;
    this.avatarError.set(null);
    this.avatarPreviewUrl.set(URL.createObjectURL(file));
  }

  protected removeAvatar(input: HTMLInputElement): void {
    this.revokeAvatarPreview();
    this.avatarFile = null;
    this.avatarPreviewUrl.set(null);
    input.value = '';
  }

  private revokeAvatarPreview(): void {
    const previewUrl = this.avatarPreviewUrl();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const data = this.form.getRawValue();

    this.form.markAsPending();

    this._authService.register(data, this.avatarFile).subscribe({
      next: (data) => {
        console.log(data);
        console.log('paso jeje');
        this._router.navigateByUrl('/');
      },
      error: (err) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrio un error',
        });

        this.isLoading.set(false);
      },
    });
  }
}
