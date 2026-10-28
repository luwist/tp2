import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostRepository } from './post.repository.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { AuthGuard } from '../common/guards/auth/auth.guard.js';
import { Types } from 'mongoose';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postRepository: PostRepository) {}

  @Post()
  create(@Body() dto: CreatePostDto, @Req() request: any) {
    console.log(dto);
    console.log(request);

    return this.postRepository.create({
      title: dto.title,
      message: dto.message,
      imageUrl: dto.imageUrl ?? '',
      author: new Types.ObjectId(request.username),
      isActive: true,
    });
  }

  @Get()
  findAll() {
    return this.postRepository.findMany();
  }
}
