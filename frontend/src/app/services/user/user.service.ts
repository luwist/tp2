import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthService } from '../auth';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getProfile(username: string) {
    return this.http.get<any>(`${environment.apiUrl}/users/${username}`);
  }

  getPosts(username: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/posts/${username}`);
  }
}
