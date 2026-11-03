import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthModule } from './auth/auth.module.js';
import { PostsModule } from './posts/post.module.js';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
