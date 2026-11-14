import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { PostsRepository } from '../posts/posts.repository.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async getProfile(username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const posts = await this.postsRepository.findListPostByUserId(user._id);

    return {
      ...user,
      posts: posts,
    };
  }
}
