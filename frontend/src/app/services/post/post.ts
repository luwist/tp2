import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthService } from '../auth';
import { environment } from '@environments/environment';

@Service()
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getFeed() {
    console.log(this.auth._token());

    return this.http.get<any>(`${environment.apiUrl}/posts`, {
      headers: { Authorization: `Bearer ${this.auth._token()}` },
    });
  }

  create(data: any, images: File[] = []) {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('body', data.body);

    images.forEach((image) => formData.append('images', image));

    console.log(data);
    console.log(images);
    console.log(formData);

    console.log(this.auth._token());

    return this.http.post<any>(`${environment.apiUrl}/posts`, formData, {
      headers: { Authorization: `Bearer ${this.auth._token()}` },
    });
  }

  like(postId: string) {
    console.log(this.auth._token());

    return this.http.post<any>(`${environment.apiUrl}/posts/${postId}/like`, {
      headers: { Authorization: `Bearer ${this.auth._token()}` },
    });
  }

  unlike(postId: string) {
    return this.http.delete<any>(`${environment.apiUrl}/posts/${postId}/like`, {
      headers: { Authorization: `Bearer ${this.auth._token()}` },
    });
  }
}
