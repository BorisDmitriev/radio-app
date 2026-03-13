import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { NowPlayingService } from '../../core/services/now-playing.service';
import {NowPlaying, NowPlayingView} from '../../shared/models/now-playing.model';

@Component({
  selector: 'app-now-playing',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe],
  templateUrl: './now-playing.component.html',
  styleUrl: './now-playing.component.scss'
})
export class NowPlayingComponent {
  readonly nowPlaying$;

  constructor(private readonly nowPlayingService: NowPlayingService) {
    this.nowPlaying$ = this.nowPlayingService.nowPlaying$.pipe(
      map((): NowPlayingView | null => this.nowPlayingService.getNowPlayingView())
    );
  }
}
