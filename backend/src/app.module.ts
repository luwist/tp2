import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthModule } from './auth/auth.module.js';
import { PostsModule } from './posts/post.module.js';

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
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      retryAttempts: 0,
    }),
    AuthModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
