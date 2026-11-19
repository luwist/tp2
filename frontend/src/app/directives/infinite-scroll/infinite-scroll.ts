import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll {
  readonly rootMargin = input('300px');
  readonly scrolled = output<void>();

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) this.scrolled.emit();
        },
        { rootMargin: this.rootMargin() },
      );

      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
