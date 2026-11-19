import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { PostsRepository } from '../posts/posts.repository.js';
import { Role } from '../common/enums/role.enum.js';
import { PasswordHasher } from '@nestjs/authentication';
import { StorageService } from '../common/storage/storage.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly storageService: StorageService,
  ) {}

  async findAll(username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new Error('NO');
    }

    return this.usersRepository.findAll();
  }

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

  async create(
    dto: CreateUserDto,
    file: Express.Multer.File,
    username: string,
  ) {
    const userAdmin = await this.usersRepository.findByEmailOrUsername(
      dto.username,
    );

    if (userAdmin && userAdmin.role !== 'admin') {
      throw new Error('ñao ñao');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingEmail = await this.usersRepository.findByEmailOrUsername(
      dto.email,
    );

    const existingUsername = await this.usersRepository.findByEmailOrUsername(
      dto.username,
    );

    if (existingEmail) {
      throw new ConflictException('Email is already in use');
    }

    if (existingUsername) {
      throw new ConflictException('Username is already in use');
    }

    const [avatarUrl, password] = await Promise.all([
      this.storageService.upload(file),
      this.passwordHasher.hash(dto.password),
    ]);

    await this.usersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.email,
      password,
      birthDate: new Date(dto.birthDate),
      bio: dto.bio,
      avatarUrl,
      role: dto.role,
      isActive: true,
    });

    return 'Creado correctamente';
  }
}
