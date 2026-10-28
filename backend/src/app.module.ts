import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthModule } from './auth/auth.module.js';
import { PostsModule } from './posts/post.module.js';
import { StorageService } from './common/storage/storage.service.js';

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
    PostsModule,
  ],
  controllers: [],
  providers: [StorageService],
})
export class AppModule {}
