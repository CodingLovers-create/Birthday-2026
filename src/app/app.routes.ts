import { Routes } from '@angular/router';
import { TemplateComponent } from './layout/template/template.component';
import { WallComponent } from './features/wall/wall.component';
import { ProfileComponent } from './features/profile/profile.component';
import { UserPostFeedComponent } from './features/profile/user-post-feed/user-post-feed.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', redirectTo: 'wall', pathMatch: 'full' },
      { path: 'wall', component: WallComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/posts/:postId', component: UserPostFeedComponent }
    ]
  }
];
