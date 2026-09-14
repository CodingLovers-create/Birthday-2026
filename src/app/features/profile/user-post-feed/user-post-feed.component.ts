import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, QueryList, ViewChildren, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../models/post.model';
import { PostsService } from '../../../services/posts.service';
import { PostCardComponent } from '../../wall/post-card/post-card.component';
import { CommentSectionComponent } from '../../wall/comment-section/comment-section.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';

@Component({
  selector: 'app-user-post-feed',
  standalone: true,
  imports: [CommonModule, PostCardComponent, CommentSectionComponent, ConfirmDialogComponent, PageHeaderComponent],
  templateUrl: './user-post-feed.component.html',
  styleUrls: ['./user-post-feed.component.scss']
})
export class UserPostFeedComponent implements OnInit {
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly activeCommentsPostId = signal<number | null>(null);
  readonly postPendingDelete = signal<Post | null>(null);

  @ViewChildren('postAnchor', { read: ElementRef }) postAnchors!: QueryList<ElementRef<HTMLElement>>;

  private targetPostId!: number;

  constructor(
    private readonly postsService: PostsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.targetPostId = Number(this.route.snapshot.paramMap.get('postId'));
    this.postsService
      .getUserPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => {
        this.posts.set(posts);
        this.isLoading.set(false);
        setTimeout(() => this.scrollToTargetPost(), 100);
      });
  }

  private scrollToTargetPost(): void {
    const index = this.posts().findIndex((post) => post.postId === this.targetPostId);
    const anchor = this.postAnchors?.toArray()[index];
    anchor?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  onPostUpdated(updated: Post): void {
    this.posts.update((posts) => posts.map((p) => (p.postId === updated.postId ? updated : p)));
  }

  requestDelete(post: Post): void {
    this.postPendingDelete.set(post);
  }

  confirmDelete(): void {
    const post = this.postPendingDelete();
    if (!post) {
      return;
    }
    this.postsService
      .deletePost(post.postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.posts.update((posts) => posts.filter((p) => p.postId !== post.postId));
        this.postPendingDelete.set(null);
      });
  }

  cancelDelete(): void {
    this.postPendingDelete.set(null);
  }
}
