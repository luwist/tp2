import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(data: Post) {
    return await this.postModel.create(data);
  }

  async findMany() {
    return await this.postModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName username avatarUrl')
      .exec();
  }
}
