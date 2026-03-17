import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import playlistSeed from '../../../assets/mock-data/playlists.json';
import { Playlist, PlaylistView } from '../../shared/models/playlist.model';
import { PlaylistEntry } from '../../shared/models/playlist-entry.model';
import playlistEntriesSeed from '../../../assets/mock-data/playlist-entries.json';
import { PlaylistRating } from '../../shared/models/playlistRating.model';
import playlistRatingSeed from '../../../assets/mock-data/playlistRating.json';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly playlists = playlistSeed as Playlist[];
  private readonly playlistEntries = playlistEntriesSeed as PlaylistEntry[];
  private readonly playlistSubject = new BehaviorSubject<Playlist[]>(
    this.playlists
  );

  readonly playlist$ = this.playlistSubject.asObservable();

  getPlaylistView(): PlaylistView[] {
    return this.playlistSubject.value.map(p => ({
      playlist_id: p.playlist_id,   
      name: p.name,
      description: p.description,
      created_at: p.created_at
    }));
  }
}