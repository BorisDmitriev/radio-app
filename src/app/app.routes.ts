import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { listenerGuard } from './core/guards/listener.guard';
import { moderatorGuard } from './core/guards/moderator.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },

  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/welcome/welcome.component').then(
        m => m.WelcomeComponent
      ),
  },

  {
    path: 'now-playing',
    canActivate: [authGuard, listenerGuard],
    loadComponent: () =>
      import('./features/now-playing/now-playing.component').then(
        m => m.NowPlayingComponent
      ),
  },
  {
    path: 'playlist-rating',
    canActivate: [authGuard, listenerGuard],
    loadComponent: () =>
      import('./features/playlist-rating/playlist-rating.component').then(
        m => m.PlaylistRatingComponent
      ),
  },
  {
    path: 'song-request',
    canActivate: [authGuard, listenerGuard],
    loadComponent: () =>
      import('./features/song-request/song-request.component').then(
        m => m.SongRequestComponent
      ),
  },
  {
    path: 'moderator-rating',
    canActivate: [authGuard, listenerGuard],
    loadComponent: () =>
      import('./features/moderator-rating/moderator-rating.component').then(
        m => m.ModeratorRatingComponent
      ),
  },
  {
    path: 'moderator-dashboard',
    canActivate: [authGuard, moderatorGuard],
    loadComponent: () =>
      import('./features/moderator-dashboard/moderator-dashboard.component').then(
        m => m.ModeratorDashboardComponent
      ),
  },

  { path: '**', redirectTo: 'welcome' },
];
