import { Routes } from '@angular/router';
import { TemplateComponent } from './layout/template/template.component';
import { WallComponent } from './features/wall/wall.component';
import { ProfileComponent } from './features/profile/profile.component';
import { UserPostFeedComponent } from './features/profile/user-post-feed/user-post-feed.component';
import { CreatePostComponent } from './features/create-post/create-post.component';
import { MainDashboardComponent } from './features/main-dashboard/main-dashboard.component';
import { SevaKiKahaniComponent } from './features/seva-ki-kahani/seva-ki-kahani.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OtpComponent } from './features/auth/otp/otp.component';
import { BannerLibraryComponent } from './features/banner-library/banner-library.component';
import { authGuard, otpGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', redirectTo: 'banner-library', pathMatch: 'full' },
      { path: 'banner-library', component: BannerLibraryComponent },
      { path: 'register', component: RegisterComponent, canActivate: [publicGuard] },
      { path: 'otp', component: OtpComponent, canActivate: [otpGuard] },
      { path: 'main', component: MainDashboardComponent, canActivate: [authGuard] },
      { path: 'wall', component: WallComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'profile/posts/:postId', component: UserPostFeedComponent, canActivate: [authGuard] },
      { path: 'create-post', component: CreatePostComponent, canActivate: [authGuard] },
      { path: 'createPost', component: CreatePostComponent, canActivate: [authGuard] },
      { path: 'seva-ki-kahani', component: SevaKiKahaniComponent, canActivate: [authGuard] }
    ]
  }
];
