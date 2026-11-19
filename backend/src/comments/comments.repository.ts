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

  async findByPost(postId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;

    return await this.commentModel
      .find({ post: postId, isActive: true })
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean()
      .exec();
  }

  async countByPost(postId: Types.ObjectId) {
    return await this.commentModel.countDocuments({
      post: postId,
      isActive: true,
    });
  }

  async findActiveById(commentId: string) {
    return await this.commentModel
      .findOne({ _id: commentId, isActive: true })
      .select('author')
      .lean()
      .exec();
  }

  async update(commentId: string, content: string) {
    return await this.commentModel
      .findOneAndUpdate(
        { _id: commentId, isActive: true },
        { $set: { content, editedAt: new Date() } },
        { new: true },
      )
      .populate('author', AUTHOR_FIELDS)
      .lean()
      .exec();
  }
}
