import { Component, input } from '@angular/core';

export type SplashVariant = 'bar' | 'dots' | 'breathe';

@Component({
  selector: 'app-splash-screen',
  styleUrl: './splash-screen.scss',
  templateUrl: './splash-screen.html',
})
export class SplashScreen {
  readonly variant = input<SplashVariant>('bar');

  protected readonly letters = Array.from('dessin');
}
