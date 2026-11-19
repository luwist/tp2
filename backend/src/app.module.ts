import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PostsModule } from './posts/posts.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { StatsModule } from './stats/stats.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthenticationModule.forRoot({
      globalGuard: false,
      session: {
        absoluteTtl: '14d',
        idleTtl: '3d',
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
