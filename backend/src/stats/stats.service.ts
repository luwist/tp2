import { BadRequestException, Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository.js';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  postsByUser(from?: string, to?: string) {
    const range = this.resolveRange(from, to);
    return this.statsRepository.postsByUser(range.from, range.to);
  }

  commentsByDay(from?: string, to?: string) {
    const range = this.resolveRange(from, to);
    return this.statsRepository.commentsByDay(range.from, range.to);
  }

  commentsPerPost(from?: string, to?: string) {
    const range = this.resolveRange(from, to);
    return this.statsRepository.commentsPerPost(range.from, range.to);
  }

  loginsByUser() {
    return this.statsRepository.loginsByUser();
  }

  profileVisitsByUser() {
    return this.statsRepository.profileVisitsByUser();
  }

  likesPerDay() {
    return this.statsRepository.likesPerDay();
  }

  private resolveRange(from?: string, to?: string) {
    const now = new Date();
    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    defaultFrom.setHours(0, 0, 0, 0);

    const parse = (value: string | undefined, endOfDay: boolean, fallback: Date) => {
      if (!value) return fallback;

      const normalized =
        value.length === 10
          ? `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`
          : value;
      const date = new Date(normalized);

      if (Number.isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date range');
      }

      return date;
    };

    const range = {
      from: parse(from, false, defaultFrom),
      to: parse(to, true, now),
    };

    if (range.from > range.to) {
      throw new BadRequestException('The start date must be before the end date');
    }

    return range;
  }
}
