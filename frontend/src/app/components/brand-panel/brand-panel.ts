import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-brand-panel',
  styleUrl: './brand-panel.scss',
  templateUrl: './brand-panel.html',
})
export class BrandPanel {
  readonly headline = input.required<string>();
  readonly description = input.required<string>();
}
