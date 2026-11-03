import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { PostImageGallery } from './post-image-gallery/post-image-gallery';
import { finalize } from 'rxjs';

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

  readonly particles = [0, 60, 120, 180, 240, 300];

  onLikeClick() {
    console.log('CLICK EN LIKE');
    console.log(this.popping());

    this.popping.set(!this.post().likedByMe);

    this.likeToggled.emit(this.post());
  }
}
