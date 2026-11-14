import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@environments/environment';

export interface PostComment {
  _id: string;
  content: string;
  createdAt: string;
  author: { username: string; firstName: string; lastName: string; avatarUrl?: string };
}

@Service()
export class CommentService {
  private readonly http = inject(HttpClient);

  getByPost(postId: string) {
    return this.http.get<PostComment[]>(`${environment.apiUrl}/comments/${postId}`);
  }

  create(postId: string, content: string) {
    return this.http.post<PostComment>(`${environment.apiUrl}/comments/${postId}`, {
      content,
    });
  }
}
