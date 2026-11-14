import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth/auth.guard.js';
import { PostSort } from '../common/enums/post-sort.enum.js';
import { PostsService } from './posts.service.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreatePostDto } from './dto/create-post.dto.js';

const MAX_IMAGES = 10;
const MAX_SIZE = 5 * 1024 * 1024;

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
    return this.postsService.create(dto, files, request.user.username);
  }

  @Get()
  findFeed(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query(
      'sortBy',
      new DefaultValuePipe(PostSort.Date),
      new ParseEnumPipe(PostSort, {
        exceptionFactory: () =>
          new BadRequestException('Invalid sort option. Use "date" or "likes"'),
      }),
    )
    sortBy: PostSort,
    @Req() request: any,
  ) {
    return this.postsService.findFeed(request.user.username, page, sortBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: any) {
    return this.postsService.findOne(id, request.user.username);
  }

  @Post(':id/like')
  like(@Param('id') id: string, @Req() req: any) {
    return this.postsService.like(id, req.user.username);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @Req() req: any) {
    return this.postsService.unlike(id, req.user.username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.postsService.delete(id, req.user.username);
  }
}
