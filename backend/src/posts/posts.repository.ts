import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity.js';
import { Model, Types } from 'mongoose';
import { PostSort } from '../common/enums/post-sort.enum.js';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(data: Post) {
    return await this.postModel.create(data);
  }

  async findListPostByUserId(userId: Types.ObjectId) {
    return await this.postModel
      .find({
        isActive: true,
        author: { $eq: userId },
      })
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName username avatarUrl')
      .lean()
      .exec();
  }

  async findListPost(
    userId: Types.ObjectId,
    page: number,
    limit: number,
    sortBy: PostSort = PostSort.Date,
  ) {
    const filter = { isActive: true, author: { $ne: userId } };
    const skip = (page - 1) * limit;

    if (sortBy === PostSort.Date) {
      return await this.postModel
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'firstName lastName username avatarUrl')
        .lean()
        .exec();
    }

    return await this.postModel
      .aggregate([
        { $match: filter },
        { $addFields: { likesCount: { $size: { $ifNull: ['$likes', []] } } } },
        { $sort: { likesCount: -1, createdAt: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
            pipeline: [
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  username: 1,
                  avatarUrl: 1,
                },
              },
            ],
          },
        },
        { $unwind: '$author' },
      ])
      .exec();
  }

  async countListPost(userId: Types.ObjectId) {
    return await this.postModel.countDocuments({
      isActive: true,
      author: { $ne: userId },
    });
  }

  async findById(id: Types.ObjectId) {
    return await this.postModel
      .findOne({ _id: id, isActive: true })
      .populate('author', 'firstName lastName username avatarUrl')
      .lean()
      .exec();
  }

  async findByIdAndUpdate(postId: string, update: any) {
    return await this.postModel
      .findByIdAndUpdate(
        {
          _id: postId,
        },
        update,
        { new: true },
      )
      .select('likes')
      .lean();
  }

  async findActiveById(postId: string) {
    return await this.postModel
      .findOne({ _id: postId, isActive: true })
      .select('author')
      .lean()
      .exec();
  }

  async softDelete(postId: string) {
    return await this.postModel
      .findOneAndUpdate(
        { _id: postId, isActive: true },
        { $set: { isActive: false } },
        { new: true },
      )
      .select('_id')
      .lean()
      .exec();
  }
}
