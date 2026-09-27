import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe';
import { NameFormatterPipe } from '../../pipes/name-formatter.pipe';
import { NumberRoundoffPipe } from '../../pipes/number-roundoff.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CapitalizeFirstPipe, NameFormatterPipe, NumberRoundoffPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);

  readonly profileName = 'You';
  readonly profileAvatar = 'https://i.pravatar.cc/150?img=12';

  ngOnInit(): void {
    const draft = this.authService.getDraftForm();
    this.postsService
      .getUserPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => {
        this.posts.set(posts);
        this.isLoading.set(false);
      });
  }

  get userDisplayName(): string {
    const draft = this.authService.getDraftForm();
    return draft?.username || this.profileName;
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/banner-library']);
  }
}
