import { Component, computed, inject, signal } from '@angular/core';
import { PostCard } from './post-card/post-card';
import { PostCardSkeleton } from './post-card-skeleton/post-card-skeleton';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
import { finalize } from 'rxjs';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { Pagination } from '@app/dto/responses/paginated.response';
import { PostService } from '@app/services/post/post.service';
import { SelectModule } from '@openng/optimus-ui/select';
import { FormsModule } from '@angular/forms';
import { ToastModule } from '@openng/optimus-ui/toast';
import { Router, RouterLink } from '@angular/router';
import { ProfileCard } from './profile-card/profile-card';

@Component({
  imports: [
    FormsModule,
    PostCard,
    PostCardSkeleton,
    ConfirmDialogModule,
    SelectModule,
    ToastModule,
    RouterLink,
    ProfileCard
  ],
  selector: 'app-feed',
  styleUrl: './feed.scss',
  templateUrl: './feed.html',
  providers: [ConfirmationService, MessageService],
})
export class Feed {
  private _postService = inject(PostService);
  private _router = inject(Router);
  private readonly confirmation = inject(ConfirmationService);

  protected readonly skeletons = [1, 2, 3];

  private readonly pendingLikes = new Set<string>();

  protected readonly isLoading = signal(true);
  protected readonly isLoadingMore = signal(false);
  protected readonly posts = signal<any[]>([]);
  private readonly pagination = signal<Pagination | null>(null);

  protected readonly hasMore = computed(() => this.pagination()?.next_page != null);

  protected readonly sortBy = signal<any>('date');

  private readonly messageService = inject(MessageService);

  protected readonly sortOptions = [
    { label: 'Más recientes', value: 'date' },
    { label: 'Más me gusta', value: 'likes' },
  ];

  ngOnInit() {
    this.loadPage(1);
  }

  protected onSortChange(sort: any) {
    this.sortBy.set(sort);
    this.posts.set([]);
    this.pagination.set(null);
    this.loadPage(1);
  }

  protected loadMore() {
    const nextPage = this.pagination()?.next_page;

    if (!nextPage || this.isLoadingMore()) return;

    this.loadPage(nextPage);
  }

  private loadPage(page: number) {
    const loadingFlag = page === 1 ? this.isLoading : this.isLoadingMore;
    loadingFlag.set(true);

    this._postService
      .getFeed(page, this.sortBy())
      .pipe(finalize(() => loadingFlag.set(false)))
      .subscribe(({ data, pagination }) => {
        this.posts.update((current) => [...current, ...data]);
        this.pagination.set(pagination);
      });
  }

  onLikeToggled(post: any) {
    console.log('POST LIKE TOGGLEADO');
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

  protected openPost(post: any) {
    console.log('ABRIR POST');
    console.log(post);

    this._router.navigate(['/posts', post._id]);
  }

  onDeleteRequested(post: any) {
    console.log('============');
    console.log(post);

    this.confirmation.confirm({
      header: 'Eliminar publicación',
      message: '¿Seguro que querés eliminar esta publicación? No se puede deshacer.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () =>
        this._postService.delete(post._id).subscribe({
          next: (response) => {
            console.log('RESPUESTA DEL POST SERVICE DELETE');
            console.log(response);

            this.posts.update((list) => list.filter((p) => p._id !== post._id));

            this.messageService.add({
              severity: 'error',
              summary: 'Publicacion eliminada correctamente',
            });
          },
          error: (error) => {
            console.log(error);

            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar la publicacion',
            });
          },
        }),
    });
  }
}
