import { Component } from '@angular/core';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';

@Component({
  imports: [SkeletonModule],
  selector: 'app-post-card-skeleton',
  styleUrl: './post-card-skeleton.scss',
  templateUrl: './post-card-skeleton.html',
})
export class PostCardSkeleton {}
