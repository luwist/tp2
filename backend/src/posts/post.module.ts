import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity.js';
import { PostRepository } from './post.repository.js';
import { StorageService } from '../common/storage/storage.service.js';
import { PostService } from './post.service.js';
import { PostController } from './post.controller.js';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../users/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostRepository, StorageService, PostService],
  exports: [],
})
export class PostsModule {}
