import { Component, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  imports: [ButtonModule],
  selector: 'app-post-image-list',
  styleUrl: './post-image-list.scss',
  templateUrl: './post-image-list.html',
})
export class PostImageList {
  readonly images = input.required<any[]>();
  readonly removed = output<string>();
}
