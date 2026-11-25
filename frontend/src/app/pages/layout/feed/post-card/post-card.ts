import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostImageGallery } from './post-image-gallery/post-image-gallery';
import { finalize } from 'rxjs';
import { MenuModule } from '@openng/optimus-ui/menu';
import { AuthService } from '@app/services/auth/auth.service';
import { TimeAgoPipe, TruncatePipe } from '@app/pipes';

@Component({
  imports: [DatePipe, PostImageGallery, MenuModule, TimeAgoPipe, RouterLink, TruncatePipe],
  selector: 'app-post-card',
  styleUrl: './post-card.scss',
  templateUrl: './post-card.html',
})
export class PostCard {
  private readonly auth = inject(AuthService);

  readonly post = input.required<any>();
  readonly showAuthor = input<boolean>(true);
  readonly likeToggled = output<any>();
  readonly deleteRequested = output<any>();
  readonly popping = signal(false);

  readonly particles = [0, 60, 120, 180, 240, 300];

  readonly isOwner = computed(
    () => this.auth.currentUser()?.username === this.post().author.username,
  );

  readonly isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');

  readonly menuItems: any[] = [
    {
      label: 'Eliminar publicación',
      icon: 'pi pi-trash',
      command: () => {
        this.onClickMenu();
      },
    },
  ];

  onClickMenu() {
    console.log('EMITIR DELETE REQUEST');

    this.deleteRequested.emit(this.post());
  }

  onLikeClick() {
    console.log('CLICK EN LIKE');
    console.log(this.popping());

    this.popping.set(!this.post().likedByMe);

    this.likeToggled.emit(this.post());
  }
}
