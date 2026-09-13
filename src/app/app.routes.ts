import { Routes } from '@angular/router';
import { TemplateComponent } from './layout/template/template.component';
import { WallComponent } from './features/wall/wall.component';
import { ProfileComponent } from './features/profile/profile.component';
import { UserPostFeedComponent } from './features/profile/user-post-feed/user-post-feed.component';
import { CreatePostComponent } from './features/create-post/create-post.component';
import { MainDashboardComponent } from './features/main-dashboard/main-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainDashboardComponent },
      { path: 'wall', component: WallComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/posts/:postId', component: UserPostFeedComponent },
      { path: 'create-post', component: CreatePostComponent },
      { path: 'createPost', component: CreatePostComponent }
    ]
  }
];
