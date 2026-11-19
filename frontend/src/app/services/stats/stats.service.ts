import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@environments/environment';

export interface StatItem {
  label: string;
  count: number;
  username?: string;
}

export interface StatDateItem {
  date: string;
  count: number;
}

@Service()
export class StatsService {
  private readonly http = inject(HttpClient);

  postsByUser(from: string, to: string) {
    return this.http.get<StatItem[]>(`${environment.apiUrl}/stats/posts-by-user`, {
      params: { from, to },
    });
  }

  commentsByDay(from: string, to: string) {
    return this.http.get<StatDateItem[]>(`${environment.apiUrl}/stats/comments-by-day`, {
      params: { from, to },
    });
  }

  commentsPerPost(from: string, to: string) {
    return this.http.get<StatItem[]>(`${environment.apiUrl}/stats/comments-per-post`, {
      params: { from, to },
    });
  }

  loginsByUser() {
    return this.http.get<StatItem[]>(`${environment.apiUrl}/stats/logins-by-user`);
  }

  profileVisitsByUser() {
    return this.http.get<StatItem[]>(`${environment.apiUrl}/stats/profile-visits`);
  }

  likesPerDay() {
    return this.http.get<StatDateItem[]>(`${environment.apiUrl}/stats/likes-per-day`);
  }
}
