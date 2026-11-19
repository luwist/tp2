import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthService } from '../auth';
import { toFormData } from '@app/utils';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/users`);
  }

  getProfile(username: string) {
    return this.http.get<any>(`${environment.apiUrl}/users/${username}`);
  }

  getPosts(username: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/posts/${username}`);
  }

  create(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/users`, toFormData(data));
  }
}
