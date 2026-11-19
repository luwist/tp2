import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth/auth.guard.js';
import { AdminGuard } from '../common/guards/admin/admin.guard.js';
import { StatsService } from './stats.service.js';

@Controller('stats')
@UseGuards(AuthGuard, AdminGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('posts-by-user')
  postsByUser(@Query('from') from?: string, @Query('to') to?: string) {
    return this.statsService.postsByUser(from, to);
  }

  @Get('comments-by-day')
  commentsByDay(@Query('from') from?: string, @Query('to') to?: string) {
    return this.statsService.commentsByDay(from, to);
  }

  @Get('comments-per-post')
  commentsPerPost(@Query('from') from?: string, @Query('to') to?: string) {
    return this.statsService.commentsPerPost(from, to);
  }

  @Get('logins-by-user')
  loginsByUser() {
    return this.statsService.loginsByUser();
  }

  @Get('profile-visits')
  profileVisitsByUser() {
    return this.statsService.profileVisitsByUser();
  }

  @Get('likes-per-day')
  likesPerDay() {
    return this.statsService.likesPerDay();
  }
}
