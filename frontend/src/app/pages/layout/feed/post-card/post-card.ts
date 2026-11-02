import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { PostImageGallery } from './post-image-gallery/post-image-gallery';

@Component({
  imports: [DatePipe, PostImageGallery],
  selector: 'app-post-card',
  styleUrl: './post-card.scss',
  templateUrl: './post-card.html',
})
export class PostCard {
  readonly post = input.required<any>();
  readonly likeToggled = output<any>();
  readonly popping = signal(false);

  onLikeClick() {
    this.popping.set(!this.post().likedByMe);
    this.likeToggled.emit(this.post());
  }
}
