import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface BannerItem {
  id: string;
  title: string;
  imageSrc: string;
  isPrimary?: boolean;
  route?: string;
  tag?: string;
}

@Component({
  selector: 'app-banner-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-library.component.html',
  styleUrls: ['./banner-library.component.scss']
})
export class BannerLibraryComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly banners: BannerItem[] = [
    {
      id: 'seva-sankalp',
      title: 'Seva Sankalp Abhiyan',
      imageSrc: 'assets/images/tile_seva_ke_rang.png',
      isPrimary: true,
      route: '/main',
      tag: 'ACTIVE CAMPAIGN'
    },
    {
      id: 'saluting-longest-serving',
      title: 'Saluting India Longest-Serving Head of Govern...',
      imageSrc: 'assets/images/tile_ai_shubhkamna.png',
      route: '/main'
    },
    {
      id: 'mann-ki-baat',
      title: 'Mann KI Baat Quiz.',
      imageSrc: 'assets/images/tile_aashirwad_ka_diya.png',
      route: '/main'
    },
    {
      id: 'vikas-yatra',
      title: 'Vikas Yatra 2026',
      imageSrc: 'assets/images/tile_seva_ki_kahani.png',
      route: '/main'
    }
  ];

  onBannerClick(banner: BannerItem): void {
    if (this.authService.isLoggedIn()) {
      const targetRoute = banner.route || '/main';
      this.router.navigate([targetRoute]);
    } else {
      this.router.navigate(['/register']);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }
    this.router.navigate(['/banner-library']);
  }
}
