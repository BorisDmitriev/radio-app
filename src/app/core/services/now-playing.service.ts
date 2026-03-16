import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import nowPlayingSeed from '../../../assets/mock-data/now-playing.json';
import tracksSeed from '../../../assets/mock-data/tracks.json';
import {NowPlaying, NowPlayingView} from '../../shared/models/now-playing.model';
import { Track } from '../../shared/models/track.model';

@Injectable({
  providedIn: 'root',
})
export class NowPlayingService {
  private readonly tracks = tracksSeed as Track[];
  private readonly nowPlayingSubject = new BehaviorSubject<NowPlaying>(
    (nowPlayingSeed as NowPlaying[])[0]
  );

  readonly nowPlaying$ = this.nowPlayingSubject.asObservable();

  getNowPlayingView(): NowPlayingView | null {
    const nowPlaying = this.nowPlayingSubject.value;
    const track = this.tracks.find(t => t.track_id === nowPlaying.track_id);

    if (!track) {
      return null;
    }

    return {
      now_playing_id: nowPlaying.now_playing_id,
      started_at: nowPlaying.started_at,
      track,
    };
  }

  updateNowPlaying(trackId: string): void {
    const current = this.nowPlayingSubject.value;

    this.nowPlayingSubject.next({
      ...current,
      track_id: trackId,
      started_at: new Date().toISOString(),
    });
  }
}
