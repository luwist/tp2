import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthService } from '../auth';
import { environment } from '@environments/environment';

@Service()
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getPosts() {
    return this.http.get<any>(`${environment.apiUrl}/posts`, {
      headers: { Authorization: `Bearer ${this.auth._token()}` },
    });
  }
}
