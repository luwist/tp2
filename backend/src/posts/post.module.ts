import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity.js';
import { PostsController } from './post.controller.js';
import { PostRepository } from './post.repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostRepository],
  exports: [],
})
export class PostsModule {}
