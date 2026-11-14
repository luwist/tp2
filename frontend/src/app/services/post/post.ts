import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthService } from '../auth';
import { environment } from '@environments/environment';
import { toFormData } from '@app/utils';

@Service()
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getFeed() {
    console.log(this.auth._token());

    return this.http.get<any>(`${environment.apiUrl}/posts`);
  }

  create(data: any, images: File[] = []) {
    return this.http.post<any>(`${environment.apiUrl}/posts`, toFormData(data));
  }

  delete(postId: string) {
    console.log('BORRAR POST CON ID');
    console.log(postId);

    return this.http.delete<any>(`${environment.apiUrl}/posts/${postId}`);
  }

  like(postId: string) {
    console.log(this.auth._token());

    return this.http.post<any>(`${environment.apiUrl}/posts/${postId}/like`, {});
  }

  unlike(postId: string) {
    return this.http.delete<any>(`${environment.apiUrl}/posts/${postId}/like`);
  }
}
