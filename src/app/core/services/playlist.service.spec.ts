import { TestBed } from '@angular/core/testing';
import { PlaylistService } from './playlist.service';

describe('NowPlayingService', () => {
  let service: PlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaylistService],
    });

    service = TestBed.inject(PlaylistService);
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte alle Playlists liefern', () => {
    const result = service.getPlaylistView();
    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBeTrue();
    expect(result.length).toBeGreaterThan(0);

    result.forEach(p => {
        expect(p.playlist_id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.created_at).toBeTruthy();
    })
    
  });
});
