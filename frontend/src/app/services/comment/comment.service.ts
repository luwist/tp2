import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@environments/environment';
import { Pagination } from '@app/dto/responses/paginated.response';

export interface PostComment {
  _id: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  author: { username: string; firstName: string; lastName: string; avatarUrl?: string };
}

export interface PaginatedComments {
  data: PostComment[];
  pagination: Pagination;
}

@Service()
export class CommentService {
  private readonly http = inject(HttpClient);

  getByPost(postId: string, page = 1) {
    return this.http.get<PaginatedComments>(
      `${environment.apiUrl}/comments/${postId}`,
      { params: { page } },
    );
  }

  create(postId: string, content: string) {
    return this.http.post<PostComment>(`${environment.apiUrl}/comments/${postId}`, {
      content,
    });
  }

  update(commentId: string, content: string) {
    return this.http.put<PostComment>(`${environment.apiUrl}/comments/${commentId}`, {
      content,
    });
  }
}
