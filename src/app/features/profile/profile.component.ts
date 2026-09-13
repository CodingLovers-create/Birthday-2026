import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe';
import { NameFormatterPipe } from '../../pipes/name-formatter.pipe';
import { NumberRoundoffPipe } from '../../pipes/number-roundoff.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CapitalizeFirstPipe, NameFormatterPipe, NumberRoundoffPipe],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);

  readonly profileName = 'You';
  readonly profileAvatar = 'https://i.pravatar.cc/150?img=12';

  constructor(
    private readonly postsService: PostsService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.postsService
      .getUserPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => {
        this.posts.set(posts);
        this.isLoading.set(false);
      });
  }

  get totalLikes(): number {
    return this.posts().reduce((sum, post) => sum + post.likes, 0);
  }

  get totalShares(): number {
    return this.posts().reduce((sum, post) => sum + post.shareCount, 0);
  }

  goBack(): void {
    this.router.navigate(['/wall']);
  }

  openPost(post: Post): void {
    this.router.navigate(['/profile/posts', post.postId]);
  }
}
