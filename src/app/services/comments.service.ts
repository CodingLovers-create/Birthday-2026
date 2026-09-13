import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Comment } from '../models/comment.model';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly commentsUrl = `${API_BASE_URL}/comments`;

  constructor(private readonly http: HttpClient) {}

  getComments(postId: number): Observable<Comment[]> {
    const params = new HttpParams().set('postId', postId).set('_sort', 'creationdate').set('_order', 'asc');
    return this.http.get<Comment[]>(this.commentsUrl, { params });
  }

  addComment(postId: number, text: string): Observable<Comment> {
    const comment: Omit<Comment, 'id'> = {
      postId,
      commentBy: 'You',
      tinyProfilePic: 'https://i.pravatar.cc/100?img=12',
      comment: text,
      likescount: 0,
      likeByMe: false,
      creationdate: new Date().toISOString()
    };
    return this.http.post<Comment>(this.commentsUrl, comment);
  }

  toggleCommentLike(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.commentsUrl}/${commentId}`).pipe(
      switchMap((comment) =>
        this.http.patch<Comment>(`${this.commentsUrl}/${commentId}`, {
          likeByMe: !comment.likeByMe,
          likescount: comment.likescount + (comment.likeByMe ? -1 : 1)
        })
      )
    );
  }
}
