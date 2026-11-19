import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/entities/post.entity.js';
import { Comment } from '../comments/entities/comment.entity.js';
import { User } from '../users/entities/user.entity.js';
import { EventType, StatEvent } from './entities/stat-event.entity.js';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(StatEvent.name) private readonly eventModel: Model<StatEvent>,
  ) {}

  async postsByUser(from: Date, to: Date) {
    return this.postModel
      .aggregate([
        { $match: { isActive: true, createdAt: { $gte: from, $lte: to } } },
        { $group: { _id: '$author', count: { $sum: 1 } } },
        {
          $lookup: {
            from: this.userModel.collection.collectionName,
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            label: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
            username: '$user.username',
            count: 1,
          },
        },
        { $sort: { count: -1, label: 1 } },
      ])
      .exec();
  }

  async commentsByDay(from: Date, to: Date) {
    return this.commentModel
      .aggregate([
        { $match: { isActive: true, createdAt: { $gte: from, $lte: to } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: '$_id', count: 1 } },
        { $sort: { date: 1 } },
      ])
      .exec();
  }

  async commentsPerPost(from: Date, to: Date) {
    return this.commentModel
      .aggregate([
        { $match: { isActive: true, createdAt: { $gte: from, $lte: to } } },
        { $group: { _id: '$post', count: { $sum: 1 } } },
        {
          $lookup: {
            from: this.postModel.collection.collectionName,
            localField: '_id',
            foreignField: '_id',
            as: 'post',
          },
        },
        { $unwind: '$post' },
        { $project: { _id: 0, label: '$post.title', count: 1 } },
        { $sort: { count: -1, label: 1 } },
      ])
      .exec();
  }

  async loginsByUser() {
    return this.eventModel
      .aggregate([
        { $match: { type: EventType.Login } },
        { $group: { _id: '$user', count: { $sum: 1 } } },
        {
          $lookup: {
            from: this.userModel.collection.collectionName,
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            label: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
            username: '$user.username',
            count: 1,
          },
        },
        { $sort: { count: -1, label: 1 } },
      ])
      .exec();
  }

  async profileVisitsByUser() {
    return this.eventModel
      .aggregate([
        { $match: { type: EventType.ProfileVisit } },
        { $group: { _id: '$targetUser', count: { $sum: 1 } } },
        {
          $lookup: {
            from: this.userModel.collection.collectionName,
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            label: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
            username: '$user.username',
            count: 1,
          },
        },
        { $sort: { count: -1, label: 1 } },
      ])
      .exec();
  }

  async likesPerDay() {
    return this.eventModel
      .aggregate([
        { $match: { type: EventType.Like } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: '$_id', count: 1 } },
        { $sort: { date: 1 } },
      ])
      .exec();
  }
}
