import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { PostsRepository } from '../posts/posts.repository.js';
import { CommentsRepository } from './comments.repository.js';
import { UsersRepository } from '../users/users.repository.js';

const COMMENTS_PAGE_SIZE = 5;

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findByPost(postId: string, page: number) {
    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postsRepository.findById(
      new Types.ObjectId(postId),
    );

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const currentPage = Math.max(1, page);
    const postObjectId = new Types.ObjectId(postId);

    const [comments, totalRecords] = await Promise.all([
      this.commentsRepository.findByPost(
        postObjectId,
        currentPage,
        COMMENTS_PAGE_SIZE,
      ),
      this.commentsRepository.countByPost(postObjectId),
    ]);

    const totalPages = Math.ceil(totalRecords / COMMENTS_PAGE_SIZE);

    return {
      data: comments,
      pagination: {
        total_records: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
        next_page: currentPage < totalPages ? currentPage + 1 : null,
        prev_page: currentPage > 1 ? currentPage - 1 : null,
      },
    };
  }

  async create(postId: string, dto: CreateCommentDto, username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postsRepository.findById(
      new Types.ObjectId(postId),
    );

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.commentsRepository.create({
      post: new Types.ObjectId(postId),
      author: new Types.ObjectId(user._id),
      content: dto.content,
    });

    return comment;
  }

  async update(commentId: string, dto: CreateCommentDto, username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isValidObjectId(commentId)) {
      throw new BadRequestException('Invalid comment id');
    }

    const comment = await this.commentsRepository.findActiveById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (!comment.author.equals(user._id)) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.commentsRepository.update(commentId, dto.content);
  }
}
