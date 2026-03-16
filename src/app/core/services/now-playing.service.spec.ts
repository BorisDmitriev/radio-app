import { TestBed } from '@angular/core/testing';
import { NowPlayingService } from './now-playing.service';

describe('NowPlayingService', () => {
  let service: NowPlayingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NowPlayingService],
    });

    service = TestBed.inject(NowPlayingService);
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte einen aktuellen Song liefern', () => {
    const result = service.getNowPlayingView();

    expect(result).toBeTruthy();
    expect(result?.track.title).toBeTruthy();
    expect(result?.track.artist).toBeTruthy();
  });

  it('sollte den aktuellen Song aktualisieren', () => {
    service.updateNowPlaying('2f1c3d4e-5b6a-4978-9c01-0a1b2c3d4e5f');

    const result = service.getNowPlayingView();

    expect(result).toBeTruthy();
    expect(result?.track).toBeTruthy();
    expect(result?.track.track_id).toBe('2f1c3d4e-5b6a-4978-9c01-0a1b2c3d4e5f');
    expect(result?.track.title).toBe('Levitating');
  });
});
