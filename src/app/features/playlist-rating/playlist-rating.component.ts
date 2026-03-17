import { Component } from '@angular/core';
import { Playlist, PlaylistView } from '../../shared/models/playlist.model';
import { PlaylistService } from '../../core/services/playlist.service';
import { map, of } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-playlist-rating',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './playlist-rating.component.html',
  styleUrl: './playlist-rating.component.scss'
})

export class PlaylistRatingComponent {
  readonly playlists$;

  constructor(private readonly playlistService: PlaylistService) {
    this.playlists$ = of(this.playlistService.getPlaylistView() || []); 
  }
}