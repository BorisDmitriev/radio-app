import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { SongRequestService } from '../../core/services/song-request.service';
import { SongRequest } from '../../shared/models/songRequest.model';

import { TrackService } from '../../core/services/track.service';
import { Track } from '../../shared/models/track.model';


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

  songRequests$: Observable<SongRequest[]>;

  constructor(
    private dashboardService: ModeratorDashboardService,
    private songRequestService: SongRequestService,
    private trackService: TrackService
  ) {
    this.stats$ = this.dashboardService.stats$;
    this.moderators$ = this.dashboardService.moderators$;

    this.playlistStats$ = this.dashboardService.playlistStats$;
    this.playlists$ = this.dashboardService.playlists$;


    this.songRequests$ = this.songRequestService.allSongRequestsSubject$;
    
    // Songwünsche laden
    this.songRequestService.loadSongRequests();
    //Tracks laden um Songtitel und Interpert anzuzeigen 
    this.loadTracks();
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

  /**
   * Songwünsche-Einsehen
   */
  tracks: Track[] = [];

  private loadTracks() {
    this.trackService.getTracks()
      .subscribe(data => {
        this.tracks = data;
      });
  }

  // Hilfsfunktion für das Template um den Interpreten und den Songtitel anzuzeigen
  getTrackName(trackId: string): string {

    const track = this.tracks.find(t => t.track_id === trackId);

    if (!track) {
      return trackId;
    }

    return `${track.artist} - ${track.title}`;
  }

  // Song als gespielt markieren
  markRequestAsPlayed(requestId: string): void {
    this.songRequestService.markAsPlayed(requestId);
  }
}
