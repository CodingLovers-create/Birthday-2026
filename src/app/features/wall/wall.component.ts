import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DEFAULT_FILTER_STATE, FilterState } from '../../models/filter.model';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { PostCardComponent } from './post-card/post-card.component';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { SortPopupComponent } from './sort-popup/sort-popup.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

const DEFAULT_PROFILE_PIC = 'https://i.pravatar.cc/100?img=12';

@Component({
  selector: 'app-wall',
  standalone: true,
  imports: [
    CommonModule,
    PostCardComponent,
    FilterPopupComponent,
    SortPopupComponent,
    CommentSectionComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './wall.component.html'
})
export class WallComponent implements OnInit {
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly isFetchingMore = signal(false);
  readonly hasMore = signal(true);
  readonly filter = signal<FilterState>(DEFAULT_FILTER_STATE);

  readonly isFilterOpen = signal(false);
  readonly isSortOpen = signal(false);
  readonly activeCommentsPostId = signal<number | null>(null);
  readonly postPendingRemoval = signal<Post | null>(null);

  readonly profilePic = DEFAULT_PROFILE_PIC;

  private offset = 0;

  constructor(
    private readonly postsService: PostsService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadFeed(true);
  }

  get isFilterApplied(): boolean {
    return this.filter().tag !== null;
  }

  get isSortApplied(): boolean {
    return this.filter().sort !== DEFAULT_FILTER_STATE.sort;
  }

  private loadFeed(reset: boolean): void {
    if (reset) {
      this.offset = 0;
      this.isLoading.set(true);
    }

    this.postsService
      .getFeed(this.offset, this.filter())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ posts, hasMore }) => {
        this.posts.set(reset ? posts : [...this.posts(), ...posts]);
        this.hasMore.set(hasMore);
        this.isLoading.set(false);
        this.isFetchingMore.set(false);
      });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollBottom = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight * 0.75;

    if (scrollBottom < threshold || this.isFetchingMore() || !this.hasMore() || this.isLoading()) {
      return;
    }

    this.isFetchingMore.set(true);
    this.offset += 1;
    this.loadFeed(false);
  }

  toggleFilter(): void {
    this.isFilterOpen.update((open) => !open);
  }

  toggleSort(): void {
    this.isSortOpen.update((open) => !open);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  applyFilter(filter: FilterState): void {
    this.filter.set(filter);
    this.loadFeed(true);
  }

  applySort(sort: FilterState['sort']): void {
    this.filter.update((current) => ({ ...current, sort }));
    this.loadFeed(true);
  }

  resetFilter(): void {
    this.applyFilter({ ...this.filter(), tag: null });
  }

  onPostUpdated(updated: Post): void {
    this.posts.update((posts) => posts.map((p) => (p.postId === updated.postId ? updated : p)));
  }

  requestRemoval(post: Post): void {
    this.postPendingRemoval.set(post);
  }

  confirmRemoval(): void {
    const post = this.postPendingRemoval();
    if (!post) {
      return;
    }

    const removal$ = post.isMine
      ? this.postsService.deletePost(post.postId)
      : this.postsService.reportPost(post.postId);

    removal$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.posts.update((posts) => posts.filter((p) => p.postId !== post.postId));
      this.postPendingRemoval.set(null);
    });
  }

  cancelRemoval(): void {
    this.postPendingRemoval.set(null);
  }
}
