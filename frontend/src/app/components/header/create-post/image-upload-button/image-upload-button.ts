import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  imports: [ButtonModule],
  selector: 'app-image-upload-button',
  styleUrl: './image-upload-button.scss',
  templateUrl: './image-upload-button.html',
})
export class ImageUploadButton {
  readonly maxFileSizeMb = 2;

  readonly disabled = input(false);

  readonly filesSelected = output<File[]>();
  readonly filesRejected = output<File[]>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  openPicker(): void {
    this.fileInput().nativeElement.click();
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    const files = Array.from(input.files ?? []);

    const maxBytes = this.maxFileSizeMb * 1024 * 1024;

    const accepted = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= maxBytes,
    );

    const rejected = files.filter((file) => !accepted.includes(file));

    if (accepted.length) this.filesSelected.emit(accepted);
    if (rejected.length) this.filesRejected.emit(rejected);
  }
}
