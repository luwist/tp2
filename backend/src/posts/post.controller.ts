import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { AuthGuard } from '../common/guards/auth/auth.guard.js';
import { Types } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PostService } from './post.service.js';

const MAX_IMAGES = 10;
const MAX_SIZE = 5 * 1024 * 1024;

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', MAX_IMAGES, {
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreatePostDto,
    @Req() request: any,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    return this.postService.create(dto, files, request.user.username);
  }

  @Get()
  findAll(@Req() request: any) {
    return this.postService.findMany(request.user.username);
  }
}
