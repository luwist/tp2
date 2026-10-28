import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { PasswordHasher } from '@nestjs/authentication';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { UsersRepository } from '../users/user.repository.js';
import { Role } from '../common/enums/role.enum.js';
import { StorageService } from '../common/storage/storage.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
    private readonly storageService: StorageService,
  ) {}

  async register(registerDto: RegisterDto, file: any) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findByEmailOrUsername(
      registerDto.email,
      registerDto.username,
    );

    console.log('QQQQQQQQQQQQQQQQQQQQQQQQQ');
    console.log(registerDto);
    console.log(existingUser);
    console.log('QQQQQQQQQQQQQQQQQQQQQQQQQ');

    if (existingUser) {
      throw new ConflictException(
        'Registration could not be completed with the provided data',
      );
    }

    const avatar = await this.storageService.upload(file);

    const passwordHash = await this.passwordHasher.hash(registerDto.password);

    const createdUser = await this.userRepository.create({
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
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (
      !user ||
      !(await this.passwordHasher.verify(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      token: token,
    };
  }

  generateToken(user: any) {
    const payload = { username: user.username, role: user.role };

    return this.jwtService.signAsync(payload);
  }
}
