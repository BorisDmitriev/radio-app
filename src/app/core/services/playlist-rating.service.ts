import { BehaviorSubject } from 'rxjs';
import { PlaylistRating, PlaylistRatingView } from '../../shared/models/playlistRating.model';
import playlistRatingSeed from '../../../assets/mock-data/playlistRating.json';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistRatingService {
    constructor(private authService: AuthService) {}

    private readonly playlistRatings: PlaylistRating[] = playlistRatingSeed.map(p => ({
        ...p,
        created_at: new Date(p.created_at)
    })); 
    private readonly playlistRatingSubject = new BehaviorSubject<PlaylistRating[]>(
        this.playlistRatings
    );

    readonly playlistRatings$ = this.playlistRatingSubject.asObservable();

    get testSubject() {
        return this.playlistRatingSubject; 
    }

    resetRatingsForTest(ratings: PlaylistRating[] = []) {
        this.playlistRatingSubject.next(ratings); 
    }

    getPlaylistRatingView(): PlaylistRatingView[] {
        return this.playlistRatingSubject.value.map(p => ({
            playlist_rating_id: p.playlist_rating_id,
            playlist_id: p.playlist_id,   
            rating_value: p.rating_value,
            comment: p.comment,
            created_at: p.created_at, 
            user_id: p.user_id
        }));
    }

    addRating(playlist_id: string, rating: number, comment: string) { 
        const currentUser = this.authService.currentUser;

        if (!currentUser) {
            return;
        }

        const current = this.playlistRatingSubject.value;
        const existing = current.find(r => r.playlist_id === playlist_id && r.user_id === currentUser.id);

        if (existing) {
            existing.rating_value = rating;
            existing.comment = comment;
        } else {
            current.push({
                playlist_rating_id: crypto.randomUUID(), 
                playlist_id,
                rating_value: rating,
                comment,
                created_at: new Date(), 
                user_id: currentUser.id
            });
        }
        this.playlistRatingSubject.next([...current]);
    }
}