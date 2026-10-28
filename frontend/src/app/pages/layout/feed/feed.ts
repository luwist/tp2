import { Component, inject, signal } from '@angular/core';
import { PostService } from '@app/services/post/post';
import { PostCard } from './post-card/post-card';
import { PostCardSkeleton } from './post-card-skeleton/post-card-skeleton';

@Component({
  imports: [PostCard, PostCardSkeleton],
  selector: 'app-feed',
  styleUrl: './feed.scss',
  templateUrl: './feed.html',
})
export class Feed {
  private _postService = inject(PostService);

  protected readonly skeletons = [1, 2, 3];
  protected readonly isLoading = signal(true);
  protected readonly posts = signal<any[]>([]);

  ngOnInit() {
    this._postService.getPosts().subscribe((data) => {
      this.posts.set(data);

      this.isLoading.set(false);
    });
  }
}
