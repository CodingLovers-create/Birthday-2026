import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent {

  constructor(private router: Router) {}

  goToCreatePost(tag: string = 'Birthday Wishes'): void {
    this.router.navigate(['/create-post'], { queryParams: { tag } });
  }

  goToWall(): void {
    this.router.navigate(['/wall']);
  }

  goBack(): void {
    this.router.navigate(['/wall']);
  }
}
