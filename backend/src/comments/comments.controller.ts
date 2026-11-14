import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth/auth.guard.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentsService } from './comments.service.js';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  findByPost(@Param('id') id: string) {
    return this.commentsService.findByPost(id);
  }

  @Post(':id')
  create(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.create(id, dto, req.user.username);
  }
}
