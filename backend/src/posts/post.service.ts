import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service.js';
import { PostRepository } from './post.repository.js';
import { isValidObjectId, Types } from 'mongoose';
import { UserRepository } from '../users/user.repository.js';

@Injectable()
export class PostService {
  constructor(
    private readonly storageService: StorageService,
    private readonly postRepository: PostRepository,
    private readonly UserRepository: UserRepository,
  ) {}

  async create(dto: any, files: Express.Multer.File[], username: string) {
    const user = await this.UserRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(dto);
    console.log(files);

    const imageUrls = await Promise.all(
      files.map((file) => this.storageService.upload(file)),
    );

    console.log(imageUrls);

    return this.postRepository.create({
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

  async findMany(username: string) {
    const user = await this.UserRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.postRepository.findFeed(user._id);
  }

  async like(postId: string, username: string) {
    const user = await this.UserRepository.findByUsername(username);

    console.log('POST SERVICE LIKE LLEGA????');
    console.log(postId);
    console.log(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postRepository.findByIdAndUpdate(postId, {
      $addToSet: { likes: new Types.ObjectId(user._id) },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      likesCount: post.likes.length,
      likedByMe: post.likes.some((id) => id.equals(user._id)),
    };
  }

  async unlike(postId: string, username: string) {
    const user = await this.UserRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isValidObjectId(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postRepository.findByIdAndUpdate(postId, {
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
}
