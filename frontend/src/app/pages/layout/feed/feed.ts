import { Component, inject, signal } from '@angular/core';
import { PostService } from '@app/services/post/post';
import { PostCard } from './post-card/post-card';
import { PostCardSkeleton } from './post-card-skeleton/post-card-skeleton';
import { finalize } from 'rxjs';

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

  private readonly pendingLikes = new Set<string>();

  ngOnInit() {
    this._postService.getFeed().subscribe((data) => {
      this.posts.set(data);

      this.isLoading.set(false);
    });
  }

  onLikeToggled(post: any) {
    console.log(post);

    if (this.pendingLikes.has(post._id)) return;

    this.pendingLikes.add(post._id);

    const wasLiked = post.likedByMe;

    this.patchPost(post._id, {
      likedByMe: !wasLiked,
      likesCount: post.likesCount + (wasLiked ? -1 : 1),
    });

    const request$ = wasLiked
      ? this._postService.unlike(post._id)
      : this._postService.like(post._id);

    request$.pipe(finalize(() => this.pendingLikes.delete(post._id))).subscribe({
      next: (res: any) => this.patchPost(post._id, res),
      error: () =>
        this.patchPost(post._id, {
          likedByMe: wasLiked,
          likesCount: post.likesCount,
        }),
    });
  }

  private patchPost(id: string, changes: Partial<any>) {
    this.posts.update((list: any) =>
      list.map((p: any) => (p._id === id ? { ...p, ...changes } : p)),
    );
  }
}
