import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent {

  constructor(private router: Router) {}

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
}
