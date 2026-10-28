import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  imports: [DatePipe],
  selector: 'app-post-card',
  styleUrl: './post-card.scss',
  templateUrl: './post-card.html',
})
export class PostCard {
  readonly post = input.required<any>();
  readonly likeToggled = output<any>();
}
