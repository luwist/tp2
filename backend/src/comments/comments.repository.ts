import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity.js';

const AUTHOR_FIELDS = 'firstName lastName username avatarUrl';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async create(data: {
    post: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
  }) {
    const comment = await this.commentModel.create(data);
    await comment.populate('author', AUTHOR_FIELDS);

    return comment.toObject();
  }

  async findByPost(postId: Types.ObjectId) {
    return await this.commentModel
      .find({ post: postId, isActive: true })
      .sort({ createdAt: -1 })
      .populate('author', AUTHOR_FIELDS)
      .lean()
      .exec();
  }
}
