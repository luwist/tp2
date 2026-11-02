import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { GalleriaModule } from '@openng/optimus-ui/galleria';

const MAX_VISIBLE_IMAGES = 4;

@Component({
  imports: [GalleriaModule],
  selector: 'app-post-image-gallery',
  templateUrl: './post-image-gallery.html',
  styleUrl: './post-image-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostImageGallery {
  readonly images = input.required<string[]>();
  readonly alt = input('');

  protected readonly isPreviewOpen = signal(false);
  protected readonly activeIndex = signal(0);

  protected readonly visibleImages = computed(() => this.images().slice(0, MAX_VISIBLE_IMAGES));

  protected readonly hiddenCount = computed(() =>
    Math.max(this.images().length - MAX_VISIBLE_IMAGES, 0),
  );

  protected readonly layoutClass = computed(
    () => `post-gallery post-gallery--${this.visibleImages().length}`,
  );

  protected openPreview(index: number): void {
    this.activeIndex.set(index);
    this.isPreviewOpen.set(true);
  }

  protected isLastVisibleWithOverflow(index: number): boolean {
    return index === MAX_VISIBLE_IMAGES - 1 && this.hiddenCount() > 0;
  }
}
