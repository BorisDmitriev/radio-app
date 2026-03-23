import { Component } from '@angular/core';
import { Playlist, PlaylistView } from '../../shared/models/playlist.model';
import { PlaylistService } from '../../core/services/playlist.service';
import { map, of } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';
import { PlaylistRating, PlaylistRatingView } from '../../shared/models/playlistRating.model';
import { PlaylistRatingService } from '../../core/services/playlist-rating.service';
import { AuthService } from '../../core/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-playlist-rating',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, MatDialogModule],
  templateUrl: './playlist-rating.component.html',
  styleUrl: './playlist-rating.component.scss'
})

export class PlaylistRatingComponent {
  readonly playlists$;
  readonly ratings$;

  constructor(
    private readonly playlistService: PlaylistService,
    private readonly playlistRatingService: PlaylistRatingService, 
    private readonly dialog: MatDialog,
    private authService: AuthService
  ) {
    this.playlists$ = this.playlistService.playlist$.pipe(
      map(playlists =>
        playlists.map(p => ({
          playlist_id: p.playlist_id, 
          name: p.name,
          description: p.description, 
          created_at: p.created_at
        }))
      )
    );
    this.ratings$ = this.playlistRatingService.playlistRatings$;
  }

  openRatingDialog(playlist: PlaylistView) {
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      alert('Einloggen erforderlich');
      return;
    }

    const existingRating = this.playlistRatingService.getPlaylistRatingView().find(r => 
      r.playlist_id === playlist.playlist_id &&
      r.user_id === currentUser.id
    )
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      width: '400px', 
      data: {
        playlist,
        rating: existingRating?.rating_value || 0, 
        comment: existingRating?.comment || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => { //sollte UI updaten
      if (result) {
        this.playlistRatingService.addRating(
          playlist.playlist_id,
          result.rating,
          result.comment
        );
      }
    });
  }

  getRatingForPlaylist(playlist: PlaylistView, ratings: PlaylistRatingView[]): number {
    const ratingObj = ratings.find(
      r => r.playlist_id === playlist.playlist_id
    );
    return ratingObj?.rating_value || 0;
  }
}