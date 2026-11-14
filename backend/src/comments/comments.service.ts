import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { PostsRepository } from '../posts/posts.repository.js';
import { CommentsRepository } from './comments.repository.js';
import { UsersRepository } from '../users/users.repository.js';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findByPost(postId: string) {
    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postsRepository.findById(
      new Types.ObjectId(postId),
    );

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.commentsRepository.findByPost(new Types.ObjectId(postId));
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
}
