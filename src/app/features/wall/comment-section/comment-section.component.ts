import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { Comment } from '../../../models/comment.model';
import { CommentsService } from '../../../services/comments.service';
import { PostsService } from '../../../services/posts.service';
import { CapitalizeFirstPipe } from '../../../pipes/capitalize-first.pipe';
import { NameFormatterPipe } from '../../../pipes/name-formatter.pipe';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizeFirstPipe, NameFormatterPipe],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {
  readonly postId = input.required<number>();
  readonly close = output<void>();

  readonly comments = signal<Comment[]>([]);
  readonly isLoading = signal(true);
  readonly isPosting = signal(false);
  newCommentText = '';

  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  private loadComments(): void {
    this.isLoading.set(true);
    this.commentsService
      .getComments(this.postId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comments) => {
        this.comments.set(comments);
        this.isLoading.set(false);
      });
  }

  timeAgo(dateString: string): string {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
  }

  toggleLike(commentId: number): void {
    this.commentsService
      .toggleCommentLike(commentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updated) => {
        this.comments.update((comments) => comments.map((c) => (c.id === commentId ? updated : c)));
      });
  }

  submitComment(): void {
    const text = this.newCommentText.trim();
    if (!text || this.isPosting()) {
      return;
    }

    this.isPosting.set(true);
    this.newCommentText = '';

    this.commentsService
      .addComment(this.postId(), text)
      .pipe(
        switchMap((comment) => {
          this.comments.update((comments) => [...comments, comment]);
          return this.postsService.incrementCommentCount(this.postId(), 1);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        complete: () => this.isPosting.set(false),
        error: () => this.isPosting.set(false)
      });
  }
}
