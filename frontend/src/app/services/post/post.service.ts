import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { PaginatedResponse } from '@app/dto/responses/paginated.response';
import { environment } from '@environments/environment';

@Service()
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getFeed(page: number, sortBy: any = 'date') {
    console.log('PAGINATION');
    console.log(page);

    return this.http.get<any>(`${environment.apiUrl}/posts`, {
      params: { page, sortBy },
    });
  }

  getById(postId: string) {
    return this.http.get<any>(`${environment.apiUrl}/posts/${postId}`);
  }

  delete(postId: string) {
    console.log(`BORRAR POST CON ID ${postId}`);
    return this.http.delete<any>(`${environment.apiUrl}/posts/${postId}`);
  }

  like(postId: string) {
    return this.http.post<any>(`${environment.apiUrl}/posts/${postId}/like`, {});
  }

  unlike(postId: string) {
    return this.http.delete<any>(`${environment.apiUrl}/posts/${postId}/like`);
  }
}
