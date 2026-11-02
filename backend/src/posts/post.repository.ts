import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity.js';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(data: Post) {
    return await this.postModel.create(data);
  }

  async findFeed(userId: Types.ObjectId) {
    return await this.postModel
      .find({
        isActive: true,
        author: { $ne: userId },
      })
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName username avatarUrl')
      .exec();
  }
}
