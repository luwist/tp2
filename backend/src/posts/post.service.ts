import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service.js';
import { PostRepository } from './post.repository.js';
import { Types } from 'mongoose';
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
}
