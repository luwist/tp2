import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '@app/services';
import { TimeAgoPipe } from '@app/pipes';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-recent-posts-card',
  imports: [RouterLink, TimeAgoPipe],
  templateUrl: './recent-posts-card.html',
  styleUrl: './recent-posts-card.scss',
})
export class RecentPostsCard implements OnInit {
  private readonly userService = inject(UserService);

  readonly posts = input<any[]>([]);
  readonly username = input<string | null>(null);
  readonly isLoading = signal(false);

  protected readonly loadedPosts = signal<any[]>([]);

  ngOnInit() {
    const username = this.username();
    if (!username) return;

    this.isLoading.set(true);
    this.userService
      .getPosts(username)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (posts) => this.loadedPosts.set(posts.slice(0, 5)),
        error: () => this.loadedPosts.set([]),
      });
  }

  protected get visiblePosts() {
    return this.username() ? this.loadedPosts() : this.posts().slice(0, 5);
  }
}
