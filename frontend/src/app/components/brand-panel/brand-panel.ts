import { Component, computed, input } from '@angular/core';
import { DesignCollage } from './design-collage/design-collage';

@Component({
  imports: [DesignCollage],
  selector: 'app-brand-panel',
  styleUrl: './brand-panel.scss',
  templateUrl: './brand-panel.html',
})
export class BrandPanel {
  readonly badge = input<string>();
  readonly headline = input.required<string>();
  /** Part of the headline that gets the selection box. Must match the text exactly. */
  readonly highlight = input<string>();
  readonly description = input.required<string>();

  protected readonly headlineParts = computed<any>(() => {
    const headline = this.headline();
    const highlight = this.highlight();
    const start = highlight ? headline.indexOf(highlight) : -1;

    if (!highlight || start === -1) {
      return { before: headline, highlight: '', after: '' };
    }

    return {
      before: headline.slice(0, start),
      highlight,
      after: headline.slice(start + highlight.length),
    };
  });
}
