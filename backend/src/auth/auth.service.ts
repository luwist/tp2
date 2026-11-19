import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { PasswordHasher } from '@nestjs/authentication';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { Role } from '../common/enums/role.enum.js';
import { StorageService } from '../common/storage/storage.service.js';
import { UsersRepository } from '../users/users.repository.js';
import { EventsRepository } from '../stats/events.repository.js';
import { EventType } from '../stats/entities/stat-event.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
    private readonly storageService: StorageService,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async register(registerDto: RegisterDto, file: Express.Multer.File) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingEmail = await this.usersRepository.findByEmailOrUsername(
      registerDto.email,
    );

    const existingUsername = await this.usersRepository.findByEmailOrUsername(
      registerDto.username,
    );

    if (existingEmail || existingUsername) {
      throw new ConflictException(
        'Registration could not be completed with the provided data',
      );
    }

    const avatar = await this.storageService.upload(file);

    const passwordHash = await this.passwordHasher.hash(registerDto.password);

    const createdUser = await this.usersRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      username: registerDto.username,
      email: registerDto.email,
      password: passwordHash,
      birthDate: new Date(registerDto.birthDate),
      bio: registerDto.bio,
      avatarUrl: avatar,
      role: Role.User,
      isActive: true,
    });

    return {
      user: {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        username: createdUser.username,
        avatarUrl: createdUser.avatarUrl,
        role: createdUser.role,
      },
      token: await this.generateToken(createdUser),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);

    if (
      !user ||
      !(await this.passwordHasher.verify(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        code: 'ACCOUNT_DISABLED',
        message: 'Account is disabled',
      });
    }

    await this.eventsRepository.record({
      type: EventType.Login,
      user: user._id,
    });

    const token = await this.generateToken(user);

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
      },
      token: token,
    };
  }

  async validateSession(username: string) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { valid: true, user: user };
  }

  async refresh(username: any) {
    const user = await this.usersRepository.findByEmailOrUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        code: 'ACCOUNT_DISABLED',
        message: 'Account is disabled',
      });
    }

    return { token: await this.generateToken(user) };
  }

  generateToken(user: any) {
    const payload = { username: user.username, role: user.role };

    return this.jwtService.signAsync(payload);
  }
}
