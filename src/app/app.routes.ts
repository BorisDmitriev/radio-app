import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'now-playing' },

  {
    path: 'now-playing',
    loadComponent: () =>
      import('./features/now-playing/now-playing.component')
        .then(m => m.NowPlayingComponent),
  },

  {
    path: 'playlist-rating',
    loadComponent: () =>
      import('./features/playlist-rating/playlist-rating.component')
        .then(m => m.PlaylistRatingComponent),
  },

  {
    path: 'song-request',
    loadComponent: () =>
      import('./features/song-request/song-request.component')
        .then(m => m.SongRequestComponent),
  },

  {
    path: 'moderator-rating',
    loadComponent: () =>
      import('./features/moderator-rating/moderator-rating.component')
        .then(m => m.ModeratorRatingComponent),
  },

  {
    path: 'moderator-dashboard',
    loadComponent: () =>
      import('./features/moderator-dashboard/moderator-dashboard.component')
        .then(m => m.ModeratorDashboardComponent),
  },

  { path: '**', redirectTo: 'now-playing' }
];
