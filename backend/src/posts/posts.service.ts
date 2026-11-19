import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service.js';
import { PostsRepository } from './posts.repository.js';
import { UsersRepository } from '../users/users.repository.js';
import { PostSort } from '../common/enums/post-sort.enum.js';
import { isValidObjectId, Types } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity.js';
import { CommentsRepository } from '../comments/comments.repository.js';
import { EventsRepository } from '../stats/events.repository.js';
import { EventType } from '../stats/entities/stat-event.entity.js';

const FEED_PAGE_SIZE = 5;

@Injectable()
export class PostsService {
  constructor(
    private readonly storageService: StorageService,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async create(dto: any, files: Express.Multer.File[], username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const imageUrls = await Promise.all(
      files.map((file) => this.storageService.upload(file)),
    );

    return this.postsRepository.create({
      title: dto.title,
      body: dto.body,
      images: imageUrls,
      author: user._id,
      isActive: true,
      likes: [],
      commentsCount: 0,
      createdAt: new Date(),
    });
  }

  async findFeed(username: string, page: number, sortBy: PostSort) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const me = new Types.ObjectId(user._id);
    const currentPage = Math.max(1, page);

    const [posts, totalRecords] = await Promise.all([
      this.postsRepository.findListPost(
        me,
        currentPage,
        FEED_PAGE_SIZE,
        sortBy,
      ),
      this.postsRepository.countListPost(me),
    ]);

    const data = posts.map(({ likes = [], ...rest }) => ({
      ...rest,
      likesCount: likes.length,
      likedByMe: likes.some((likeId: any) => likeId.equals(me)),
    }));

    const totalPages = Math.ceil(totalRecords / FEED_PAGE_SIZE);

    return {
      data,
      pagination: {
        total_records: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
        next_page: currentPage < totalPages ? currentPage + 1 : null,
        prev_page: currentPage > 1 ? currentPage - 1 : null,
      },
    };
  }

  async findOne(postId: string, username: string) {
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

    const me = new Types.ObjectId(user._id);

    const { likes = [], ...rest } = post;

    return {
      ...rest,
      likesCount: likes.length,
      likedByMe: likes.some((likeId: any) => likeId.equals(me)),
    };
  }

  async like(postId: string, username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postsRepository.findByIdAndUpdate(postId, {
      $addToSet: { likes: new Types.ObjectId(user._id) },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.eventsRepository.record({
      type: EventType.Like,
      user: user._id,
      post: new Types.ObjectId(postId),
    });

    return {
      likesCount: post.likes.length,
      likedByMe: post.likes.some((id) => id.equals(user._id)),
    };
  }

  async unlike(postId: string, username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postsRepository.findByIdAndUpdate(postId, {
      $pull: { likes: new Types.ObjectId(user._id) },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      likesCount: post.likes.length,
      likedByMe: post.likes.some((id) => id.equals(user._id)),
    };
  }

  async delete(postId: string, username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postsRepository.findActiveById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isOwner = post.author.equals(user._id);
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    const deleted = await this.postsRepository.softDelete(postId);

    if (!deleted) {
      throw new NotFoundException('Post not found');
    }

    return { message: 'Post deleted successfully' };
  }
}
