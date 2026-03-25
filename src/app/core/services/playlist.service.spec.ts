import { PlaylistService } from './playlist.service';
import { Playlist } from '../../shared/models/playlist.model';

describe('PlaylistService', () => {
  let service: PlaylistService;

    const mockPlaylists: Playlist[] = [{
      playlist_id: '1', 
      name: 'Test', 
      description: 'Test', 
      created_at: '2026-03-03'
    }]; 

  beforeEach(() => {
    service = new PlaylistService();
    service.resetPlaylistsForTest(mockPlaylists); 
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Playlists korrekt liefern', () => {
    
    const result = service.getPlaylistView();

    expect(result).toEqual([{
      playlist_id: '1', 
      name: 'Test', 
      description: 'Test', 
      created_at: '2026-03-03'
    }]); 
  });
});
