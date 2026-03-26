import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import playlistSeed from '../../../assets/mock-data/playlist.json';
import { Playlist, PlaylistView } from '../../shared/models/playlist.model';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly playlists = playlistSeed as Playlist[];
  private readonly playlistSubject = new BehaviorSubject<Playlist[]>(
    this.playlists
  );

  readonly playlist$ = this.playlistSubject.asObservable();

  resetPlaylistsForTest(playlists: Playlist[] = []) {
    this.playlistSubject.next([...playlists]); 
  }

  getPlaylistView(): PlaylistView[] {
    return this.playlistSubject.value.map(p => ({
      playlist_id: p.playlist_id,   
      name: p.name,
      description: p.description,
      created_at: p.created_at
    }));
  }
}
