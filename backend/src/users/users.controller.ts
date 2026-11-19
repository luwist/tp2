import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth/auth.guard.js';
import { AdminGuard } from '../common/guards/admin/admin.guard.js';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.username);
  }

  @Get(':username')
  getProfile(@Param('username') username: string, @Req() req: any) {
    return this.usersService.getProfile(username, req.user?.username);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() dto: CreateUserDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.create(dto, file, req.user.username);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  setActive(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.usersService.setActive(id, dto.isActive);
  }
}
