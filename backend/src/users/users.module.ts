import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller.js';
import { User, UserSchema } from './entities/user.entity.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { PostsModule } from '../posts/posts.module.js';
import { CommentsModule } from '../comments/comments.module.js';
import { StorageService } from '../common/storage/storage.service.js';
import { StatsModule } from '../stats/stats.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => PostsModule),
    forwardRef(() => CommentsModule),
    StatsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, StorageService],
  exports: [UsersRepository],
})
export class UsersModule {}
