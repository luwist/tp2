import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller.js';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity.js';
import { PostsRepository } from './posts.repository.js';
import { PostsService } from './posts.service.js';
import { UsersModule } from '../users/users.module.js';
import { StorageService } from '../common/storage/storage.service.js';
import { CommentsModule } from '../comments/comments.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, StorageService],
  exports: [PostsRepository],
})
export class PostsModule {}
