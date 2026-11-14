import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { AuthService, UserService } from '@app/services';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { finalize, forkJoin } from 'rxjs';
import { PostCard } from '../feed/post-card/post-card';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '@app/services/post/post.service';
import { ToastModule } from '@openng/optimus-ui/toast';

@Component({
  imports: [ConfirmDialogModule, SkeletonModule, PostCard, ToastModule],
  selector: 'app-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
  providers: [ConfirmationService, MessageService],
})
export class Profile {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private readonly auth = inject(AuthService);

  private readonly messageService = inject(MessageService);

  private readonly usersService = inject(UserService);
  private readonly postsService = inject(PostService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly pendingLikes = new Set<string>();
  readonly username = signal<string>('');
  readonly profile = signal<any | null>(null);
  readonly posts = signal<any[]>([]);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly isOwn = computed(() => this.auth.user()?.username === this.username());

  constructor() {
    // effect(() => {
    //   const username = this.username();
    //   untracked(() => this.load(username));
    // });
  }

  ngOnInit() {
    const username = this._route.snapshot.paramMap.get('username')!;

    // this.usersService.getProfile(username)

    this.username.set(username);
    this.load(username);
  }

  private load(username: string) {
    this.loading.set(true);
    this.notFound.set(false);
    forkJoin({
      profile: this.usersService.getProfile(username),
      // posts: this.usersService.getPosts(username),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ profile }) => {
          console.log(profile);
          this.profile.set(profile);
          this.posts.set(profile.posts);
        },
        error: () => this.notFound.set(true),
      });
  }
  onLikeToggled(post: any) {
    if (this.pendingLikes.has(post.id)) return;
    this.pendingLikes.add(post.id);
    const wasLiked = post.likedByMe;
    this.patchPost(post.id, {
      likedByMe: !wasLiked,
      likesCount: post.likesCount + (wasLiked ? -1 : 1),
    });
    const request$ = wasLiked ? this.postsService.unlike(post.id) : this.postsService.like(post.id);
    request$.pipe(finalize(() => this.pendingLikes.delete(post.id))).subscribe({
      next: (res) => this.patchPost(post.id, res),
      error: () => this.patchPost(post.id, { likedByMe: wasLiked, likesCount: post.likesCount }),
    });
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
        this.postsService.delete(post._id).subscribe({
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
  private patchPost(id: string, changes: Partial<any>) {
    this.posts.update((list) => list.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }
}
