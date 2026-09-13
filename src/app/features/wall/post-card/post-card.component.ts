import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post } from '../../../models/post.model';
import { PostsService } from '../../../services/posts.service';
import { SdkService } from '../../../services/sdk.service';
import { PinchZoomDirective } from '../../../directives/pinch-zoom.directive';
import { CapitalizeFirstPipe } from '../../../pipes/capitalize-first.pipe';
import { NameFormatterPipe } from '../../../pipes/name-formatter.pipe';
import { NumberRoundoffPipe } from '../../../pipes/number-roundoff.pipe';
import { StringTrimmerPipe } from '../../../pipes/string-trimmer.pipe';

const DESCRIPTION_PREVIEW_LENGTH = 80;

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, PinchZoomDirective, CapitalizeFirstPipe, NameFormatterPipe, NumberRoundoffPipe, StringTrimmerPipe],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {
  readonly post = input.required<Post>();

  // post is a read-only signal, so a like/share response can't be written back into
  // it directly - the parent owns the data and applies the change via this output.
  readonly updated = output<Post>();
  readonly report = output<Post>();
  readonly delete = output<Post>();
  readonly openComments = output<Post>();

  readonly descriptionPreviewLength = DESCRIPTION_PREVIEW_LENGTH;
  readonly currentImageIndex = signal(0);
  readonly isDescriptionExpanded = signal(false);
  readonly isMenuOpen = signal(false);
  readonly isZoomOpen = signal(false);

  private touchStartX = 0;

  constructor(
    private readonly postsService: PostsService,
    private readonly sdkService: SdkService,
    private readonly destroyRef: DestroyRef
  ) {}

  get isDescriptionLong(): boolean {
    return this.post().description.length > DESCRIPTION_PREVIEW_LENGTH;
  }

  get timeAgo(): string {
    const diffMs = Date.now() - new Date(this.post().postCreationOrModificationDate).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) {
      return 'Just now';
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return days < 7 ? `${days}d ago` : `${Math.floor(days / 7)}w ago`;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const diff = this.touchStartX - event.changedTouches[0].clientX;
    if (diff > 50) {
      this.nextImage();
    } else if (diff < -50) {
      this.previousImage();
    }
  }

  nextImage(): void {
    if (this.currentImageIndex() < this.post().images.length - 1) {
      this.currentImageIndex.update((index) => index + 1);
    }
  }

  previousImage(): void {
    if (this.currentImageIndex() > 0) {
      this.currentImageIndex.update((index) => index - 1);
    }
  }

  toggleDescription(): void {
    this.isDescriptionExpanded.update((expanded) => !expanded);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  openZoom(): void {
    this.isZoomOpen.set(true);
  }

  closeZoom(): void {
    this.isZoomOpen.set(false);
  }

  toggleLike(): void {
    this.postsService
      .toggleLike(this.post().postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updated) => this.updated.emit(updated));
  }

  share(): void {
    this.postsService
      .registerShare(this.post().postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updated) => this.updated.emit(updated));

    const shareText = `${this.post().userName}'s birthday post: ${this.post().description}`;
    this.sdkService.shareImage(shareText, this.post().images[this.currentImageIndex()]);
  }

  onMenuAction(): void {
    this.isMenuOpen.set(false);
    if (this.post().isMine) {
      this.delete.emit(this.post());
    } else {
      this.report.emit(this.post());
    }
  }
}
