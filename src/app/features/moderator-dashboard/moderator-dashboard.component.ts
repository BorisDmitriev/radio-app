import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  ModeratorDashboardService,
  DashboardStats,
  Moderator,
  Playlist
} from '../../core/services/moderator-dashboard.service';

import { ModeratorRating } from '../../shared/models/moderatorRating.model';
import { PlaylistRating } from '../../shared/models/playlistRating.model';

@Component({
  selector: 'app-moderator-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.scss'
})

export class ModeratorDashboardComponent {

  stats$: Observable<DashboardStats<ModeratorRating>>;
  moderators$: Observable<Moderator[]>;

  playlistStats$: Observable<DashboardStats<PlaylistRating>>;
  playlists$: Observable<Playlist[]>;

  constructor(private dashboardService: ModeratorDashboardService) {
    this.stats$ = this.dashboardService.stats$;
    this.moderators$ = this.dashboardService.moderators$;

    this.playlistStats$ = this.dashboardService.playlistStats$;
    this.playlists$ = this.dashboardService.playlists$;
  }

  onModeratorChange(event: Event) {
    const moderatorId = (event.target as HTMLSelectElement).value;
    this.dashboardService.setModerator(moderatorId);
  }

  onPlaylistChange(event: Event) {
    const playlistId = (event.target as HTMLSelectElement).value;
    this.dashboardService.setPlaylist(playlistId);
  }

  // Bewertung runden
  getRoundedRating(value: number): number {
    return Math.round(value);
  }
}
