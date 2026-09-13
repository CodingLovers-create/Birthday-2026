import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, switchMap, tap } from 'rxjs';
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
  private readonly postCreatedSource = new Subject<Post>();

  /** Observable stream emitted whenever a new post is created across components */
  readonly postCreated$ = this.postCreatedSource.asObservable();

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

  getPostById(targetId: number | string): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${targetId}`);
  }

  toggleLike(targetId: number | string): Observable<Post> {
    return this.getPostById(targetId).pipe(
      switchMap((post) =>
        this.http.patch<Post>(`${this.postsUrl}/${targetId}`, {
          likeByMe: !post.likeByMe,
          likes: post.likes + (post.likeByMe ? -1 : 1)
        })
      )
    );
  }

  registerShare(targetId: number | string): Observable<Post> {
    return this.getPostById(targetId).pipe(
      switchMap((post) => this.http.patch<Post>(`${this.postsUrl}/${targetId}`, { shareCount: post.shareCount + 1 }))
    );
  }

  reportPost(targetId: number | string): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${targetId}`);
  }

  deletePost(targetId: number | string): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${targetId}`);
  }

  incrementCommentCount(targetId: number | string, delta: number): Observable<Post> {
    return this.getPostById(targetId).pipe(
      switchMap((post) =>
        this.http.patch<Post>(`${this.postsUrl}/${targetId}`, { commentCount: post.commentCount + delta })
      )
    );
  }

  createPost(newPostData: Partial<Post>): Observable<Post> {
    const newId = Date.now();
    const postPayload: Post = {
      id: newId,
      postId: newId,
      userName: newPostData.userName || 'Aarav Sharma',
      tinyProfilePic: newPostData.tinyProfilePic || 'https://i.pravatar.cc/100?img=1',
      profilePic: newPostData.profilePic || 'https://i.pravatar.cc/300?img=1',
      images: newPostData.images && newPostData.images.length ? newPostData.images : ['assets/images/templates/Preview1.webp'],
      description: newPostData.description || 'Wishing you a very Happy Birthday! 🎉',
      tag: newPostData.tag || 'Birthday Wishes',
      likes: 0,
      likeByMe: false,
      shareCount: 0,
      commentCount: 0,
      postCreationOrModificationDate: new Date().toISOString(),
      isMine: true
    };
    return this.http.post<Post>(this.postsUrl, postPayload).pipe(
      tap((createdPost) => this.postCreatedSource.next(createdPost))
    );
  }
}
