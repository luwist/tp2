import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminGuard } from '../common/guards/admin/admin.guard.js';
import { Comment, CommentSchema } from '../comments/entities/comment.entity.js';
import { Post, PostSchema } from '../posts/entities/post.entity.js';
import { User, UserSchema } from '../users/entities/user.entity.js';
import { EventsRepository } from './events.repository.js';
import { StatEvent, StatEventSchema } from './entities/stat-event.entity.js';
import { StatsController } from './stats.controller.js';
import { StatsRepository } from './stats.repository.js';
import { StatsService } from './stats.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StatEvent.name, schema: StatEventSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService, StatsRepository, EventsRepository, AdminGuard],
  exports: [EventsRepository],
})
export class StatsModule {}
