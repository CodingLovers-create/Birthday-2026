import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  goToCreatePost(tag: string = 'Birthday Wishes'): void {
    if (tag === 'Seva Ki Kahani') {
      this.router.navigate(['/seva-ki-kahani']);
    } else {
      this.router.navigate(['/create-post'], { queryParams: { tag } });
    }
  }

  goToWall(): void {
    this.router.navigate(['/wall']);
  }

  goBack(): void {
    this.router.navigate(['/wall']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/banner-library']);
  }
}
