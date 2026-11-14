import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsRepository } from './comments.repository.js';
import { CommentsService } from './comments.service.js';
import { CommentsController } from './comments.controller.js';
import { Comment, CommentSchema } from './entities/comment.entity.js';
import { UsersModule } from '../users/users.module.js';
import { PostsModule } from '../posts/posts.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),
    forwardRef(() => PostsModule),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository],
})
export class CommentsModule {}
