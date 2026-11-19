import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel
      .findOne({
        email: email.toLowerCase(),
      })
      .lean()
      .exec();
  }

  async findAll() {
    return await this.userModel
      .find()
      .select('_id firstName lastName avatarUrl role isActive')
      .exec();
  }

  async findByEmailOrUsername(
    identifier: string,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findOne({
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
      })
      .select('-password')
      .lean()
      .exec();
  }

  async create(data: User): Promise<UserDocument> {
    return await this.userModel.create(data);
  }

  async setActive(id: string, isActive: boolean) {
    return await this.userModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .select('_id firstName lastName avatarUrl role isActive')
      .exec();
  }
}
