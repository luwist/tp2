import { Component, computed, inject, model, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, PostService } from '@app/services';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { ImageUploadButton } from './image-upload-button/image-upload-button';
import { PostImageList } from './post-image-list/post-image-list';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';

@Component({
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    ImageUploadButton,
    PostImageList,
  ],
  selector: 'app-create-post',
  styleUrl: './create-post.scss',
  templateUrl: './create-post.html',
  providers: [MessageService],
})
export class CreatePost {
  private readonly messageService = inject(MessageService);

  readonly auth = inject(AuthService);

  readonly images = signal<any[]>([]);

  readonly visible = model(false);

  readonly isImageLimitReached = computed(() => this.images().length >= this.maxImages);

  readonly maxImages = 4;

  isLoading = signal(false);

  private readonly postService = inject(PostService);

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    body: new FormControl('', [Validators.required, Validators.maxLength(2000)]),
  });

  removeImage(id: string): void {
    const image = this.images().find((i) => i.id === id);

    if (image) URL.revokeObjectURL(image.previewUrl);

    this.images.update((current: any) => current.filter((i: any) => i.id !== id));
  }

  onFilesSelected(files: any[]): void {
    const availableSlots = this.maxImages - this.images().length;

    const newImages = files.slice(0, availableSlots).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    this.images.update((current) => [...current, ...newImages]);

    console.log(this.images());
  }

  onFilesRejected(files: File[]): void {
    files.map((f) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Imagen demasiado grande',
        data: {
          fileName: f.name,
        },
      });
    });
  }

  close(): void {
    this.visible.set(false);
  }

  onHide(): void {
    this.images().forEach((i: any) => URL.revokeObjectURL(i.previewUrl));

    this.images.set([]);

    this.form.reset();
  }

  onPublish(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const data = this.form.getRawValue();

    this.isLoading.set(true);

    this.postService
      .create(
        data,
        this.images().map((i: any) => i.file),
      )
      .subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.isLoading.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Publicación creada',
          });

          this.close();
        },
        error: (error) => {
          console.error('Error creating post:', error);
          this.isLoading.set(false);
        },
      });
  }
}
