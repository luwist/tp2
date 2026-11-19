import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '@app/services/post/post.service';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
import { ToastModule } from '@openng/optimus-ui/toast';
import { finalize, forkJoin } from 'rxjs';
import { PostCard } from '../feed/post-card/post-card';
import { PostCardSkeleton } from '../feed/post-card-skeleton/post-card-skeleton';
import { CommentService, PostComment } from '@app/services';
import { AuthService } from '@app/services/auth/auth.service';
import { TimeAgoPipe } from '@app/pipes';
import { Pagination } from '@app/dto/responses/paginated.response';

const MAX_COMMENT_LENGTH = 500;
const COMMENTS_PAGE_SIZE = 5;

@Component({
  imports: [
    PostCard,
    PostCardSkeleton,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    TimeAgoPipe,
  ],
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
  providers: [ConfirmationService, MessageService],
})
export class PostDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  private readonly commentService = inject(CommentService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly auth = inject(AuthService);

  private readonly pendingLikes = new Set<string>();
  private postId = '';

  protected readonly maxLength = MAX_COMMENT_LENGTH;
  protected readonly post = signal<any | null>(null);
  protected readonly comments = signal<PostComment[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly isLoadingMore = signal(false);
  protected readonly editingCommentId = signal<string | null>(null);
  protected readonly isUpdatingComment = signal(false);

  private readonly pagination = signal<Pagination | null>(null);

  protected readonly currentUsername = computed(() => this.auth.currentUser()?.username);
  protected readonly hasMoreComments = computed(() => this.pagination()?.next_page != null);
  protected readonly totalComments = computed(
    () => this.pagination()?.total_records ?? this.post()?.commentsCount ?? this.comments().length,
  );

  protected readonly commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(MAX_COMMENT_LENGTH)],
  });

  protected readonly editControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(MAX_COMMENT_LENGTH)],
  });

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id')!;

    console.log('DETALLE DEL POST');
    console.log(this.postId);

    forkJoin({
      post: this.postService.getById(this.postId),
      comments: this.commentService.getByPost(this.postId),
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          console.log('POSTTT');
          console.log(data);
          this.post.set(data.post);
          this.comments.set(data.comments.data);
          // console.log('PAGINATION POSTTT');
          // console.log(comments.pagination);
          this.pagination.set(data.comments.pagination);
        },
        error: () => this.notFound.set(true),
      });
  }

  protected submitComment() {
    const content = this.commentControl.value.trim();

    if (!content || this.commentControl.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    this.commentService
      .create(this.postId, content)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (comment) => {
          this.comments.update((list) => [comment, ...list]);
          this.pagination.update((p) => {
            if (!p) return p;

            const totalRecords = p.total_records + 1;
            const totalPages = Math.ceil(totalRecords / COMMENTS_PAGE_SIZE);

            return {
              ...p,
              total_records: totalRecords,
              total_pages: totalPages,
              next_page: p.current_page < totalPages ? p.current_page + 1 : null,
            };
          });
          this.post.update((p) => p && { ...p, commentsCount: (p.commentsCount ?? 0) + 1 });
          this.commentControl.reset();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo publicar el comentario',
          }),
      });
  }

  protected loadMoreComments() {
    const nextPage = this.pagination()?.next_page;

    if (!nextPage || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);

    this.commentService
      .getByPost(this.postId, nextPage)
      .pipe(finalize(() => this.isLoadingMore.set(false)))
      .subscribe({
        next: ({ data, pagination }) => {
          this.comments.update((current) => [
            ...current,
            ...data.filter((comment) => !current.some((item) => item._id === comment._id)),
          ]);
          this.pagination.set(pagination);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudieron cargar más comentarios',
          }),
      });
  }

  protected startEdit(comment: PostComment) {
    this.editingCommentId.set(comment._id);
    this.editControl.setValue(comment.content);
  }

  protected cancelEdit() {
    this.editingCommentId.set(null);
    this.editControl.reset();
  }

  protected saveEdit(comment: PostComment) {
    const content = this.editControl.value.trim();

    if (!content || this.editControl.invalid || this.isUpdatingComment()) return;

    this.isUpdatingComment.set(true);

    this.commentService
      .update(comment._id, content)
      .pipe(finalize(() => this.isUpdatingComment.set(false)))
      .subscribe({
        next: (updated) => {
          this.comments.update((list) =>
            list.map((item) =>
              item._id === comment._id
                ? {
                    ...item,
                    content: updated.content,
                    editedAt: updated.editedAt ?? new Date().toISOString(),
                  }
                : item,
            ),
          );
          this.cancelEdit();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo actualizar el comentario',
          }),
      });
  }

  protected onLikeToggled(post: any) {
    if (this.pendingLikes.has(post._id)) return;
    this.pendingLikes.add(post._id);

    const wasLiked = post.likedByMe;
    this.patchPost({ likedByMe: !wasLiked, likesCount: post.likesCount + (wasLiked ? -1 : 1) });

    const request$ = wasLiked ? this.postService.unlike(post._id) : this.postService.like(post._id);

    request$.pipe(finalize(() => this.pendingLikes.delete(post._id))).subscribe({
      next: (res) => this.patchPost(res),
      error: () => this.patchPost({ likedByMe: wasLiked, likesCount: post.likesCount }),
    });
  }

  protected onDeleteRequested(post: any) {
    this.confirmation.confirm({
      header: 'Eliminar publicación',
      message: '¿Seguro que querés eliminar esta publicación? No se puede deshacer.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () =>
        this.postService.delete(post._id).subscribe({
          next: () => this.router.navigate(['/posts']),
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar la publicación',
            }),
        }),
    });
  }

  private patchPost(changes: Partial<any>) {
    this.post.update((p) => p && { ...p, ...changes });
  }
}
