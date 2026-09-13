import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { FilterState } from '../models/filter.model';
import { Post } from '../models/post.model';
import { API_BASE_URL } from './api-config';

const PAGE_SIZE = 6;

export interface FeedPage {
  posts: Post[];
  hasMore: boolean;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly postsUrl = `${API_BASE_URL}/posts`;

  constructor(private readonly http: HttpClient) {}

  getFeed(offset: number, filter: FilterState): Observable<FeedPage> {
    let params = new HttpParams()
      .set('_page', String(offset + 1))
      .set('_limit', String(PAGE_SIZE))
      .set('_sort', filter.sort === 'popular' ? 'likes' : 'postCreationOrModificationDate')
      .set('_order', 'desc');

    if (filter.tag) {
      params = params.set('tag', filter.tag);
    }

    return this.http.get<Post[]>(this.postsUrl, { params, observe: 'response' }).pipe(
      map((response) => {
        const totalCount = Number(response.headers.get('X-Total-Count') ?? 0);
        const posts = response.body ?? [];
        return { posts, hasMore: (offset + 1) * PAGE_SIZE < totalCount };
      })
    );
  }

  getUserPosts(): Observable<Post[]> {
    const params = new HttpParams().set('isMine', 'true');
    return this.http.get<Post[]>(this.postsUrl, { params });
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${postId}`);
  }

  toggleLike(postId: number): Observable<Post> {
    return this.getPostById(postId).pipe(
      switchMap((post) =>
        this.http.patch<Post>(`${this.postsUrl}/${postId}`, {
          likeByMe: !post.likeByMe,
          likes: post.likes + (post.likeByMe ? -1 : 1)
        })
      )
    );
  }

  registerShare(postId: number): Observable<Post> {
    return this.getPostById(postId).pipe(
      switchMap((post) => this.http.patch<Post>(`${this.postsUrl}/${postId}`, { shareCount: post.shareCount + 1 }))
    );
  }

  reportPost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${postId}`);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${postId}`);
  }

  incrementCommentCount(postId: number, delta: number): Observable<Post> {
    return this.getPostById(postId).pipe(
      switchMap((post) =>
        this.http.patch<Post>(`${this.postsUrl}/${postId}`, { commentCount: post.commentCount + delta })
      )
    );
  }
}
