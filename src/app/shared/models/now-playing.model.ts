import {Track} from './track.model';

export interface NowPlaying {
  now_playing_id: string;
  track_id: string; // Der letzte Eintrag wäre aktuell der laufende Song
  started_at: string;
}

export interface NowPlayingView {
  now_playing_id: string;
  started_at: string;
  track: Track;
}
