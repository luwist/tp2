import { Component, inject, model, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { dateValidator } from '@app/validators/date.validator';
import { passwordMatchValidator } from '@app/validators/password-match.validator';
import { AvatarModule } from '@openng/optimus-ui/avatar';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { AvatarUploader } from '@app/components/ui';
import { InputMaskModule } from '@openng/optimus-ui/inputmask';
import { UserService } from '@app/services';
import { MessageService } from '@openng/optimus-ui/api';
import { ToastModule } from '@openng/optimus-ui/toast';

@Component({
  imports: [
    AvatarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    RadioButtonModule,
    ReactiveFormsModule,
    TextareaModule,
    AvatarUploader,
    InputMaskModule,
    ToastModule,
  ],
  selector: 'app-create-user',
  styleUrl: './create-user.scss',
  templateUrl: './create-user.html',
  providers: [MessageService],
})
export class CreateUser {
  readonly visible = model(false);

  isLoading = signal(false);
  readonly created = output<any>();

  private userService = inject(UserService);
  private readonly messageService = inject(MessageService);

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
      role: new FormControl('user'),
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

  protected async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const data = this.form.getRawValue();

    this.userService.create(data).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.isLoading.set(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Usuario creado',
          detail: 'El usuario se creo correctamente.',
        });

        this.created.emit(response);

        this.close();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'No pudimos publicar',
          detail: 'Algo salió mal. Intentá de nuevo.',
        });

        this.isLoading.set(false);
      },
    });
  }

  protected reset(): void {
    this.form.reset();
    // this.clearAvatar();
    // const input = this.fileInput();
    // if (input) {
    //   input.nativeElement.value = '';
    // }
  }

  protected close(): void {
    this.visible.set(false);
    this.reset();
  }

  protected getError(name: any) {
    // const control = this.form.controls[name];
    // if (!control.touched) {
    //   return null;
    // }
    // if (control.errors) {
    //   const messages = this.errorMessages[name];
    //   const key = Object.keys(control.errors).find((errorKey) => messages[errorKey]);
    //   return key ? messages[key] : null;
    // }
    // if (name === 'confirmPassword' && this.form.hasError('passwordMismatch')) {
    //   return 'Las contraseñas no coinciden.';
    // }
    // return null;
  }
}
