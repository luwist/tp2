import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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

const MAX_COMMENT_LENGTH = 500;

@Component({
  imports: [
    PostCard,
    PostCardSkeleton,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
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

  private readonly pendingLikes = new Set<string>();
  private postId = '';

  protected readonly maxLength = MAX_COMMENT_LENGTH;
  protected readonly post = signal<any | null>(null);
  protected readonly comments = signal<PostComment[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly commentControl = new FormControl('', {
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
        next: ({ post, comments }) => {
          console.log('POSTTT');
          console.log(post);
          this.post.set(post);
          this.comments.set(comments);
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
