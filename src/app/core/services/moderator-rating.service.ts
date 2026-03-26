import { BehaviorSubject } from 'rxjs';
import { ModeratorRating, ModeratorRatingView } from '../../shared/models/moderatorRating.model';
import moderatorRatingSeed from '../../../assets/mock-data/moderatorRating.json';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ModeratorRatingService {
    constructor(private authService: AuthService) {}

    private readonly moderatorRatings: ModeratorRating[] = moderatorRatingSeed.map(p => ({
        ...p,
        created_at: new Date(p.created_at)
    }));
    private readonly moderatorRatingSubject = new BehaviorSubject<ModeratorRating[]>(
        this.moderatorRatings
    );

    readonly moderatorRatings$ = this.moderatorRatingSubject.asObservable();

        resetRatingsForTest(ratings: ModeratorRating[] = []) {
            this.moderatorRatingSubject.next(ratings); 
        }

    getModeratorRatingView(): ModeratorRatingView[] {
        return this.moderatorRatingSubject.value.map(p => ({
            moderator_rating_id: p.moderator_rating_id,
            moderator_id: p.moderator_id,   
            rating_value: p.rating_value,
            comment: p.comment,
            created_at: p.created_at, 
            user_id: p.user_id
        }));
    }

    addRating(moderator_id: string, rating: number, comment: string) { 
        const currentUser = this.authService.currentUser;

        if (!currentUser) {
            return;
        }

        const current = this.moderatorRatingSubject.value;
        const existing = current.find(r => r.moderator_id === moderator_id && r.user_id === currentUser.id);

        if (existing) {
            existing.rating_value = rating;
            existing.comment = comment;
        } else {
            current.push({
                moderator_rating_id: crypto.randomUUID(), 
                moderator_id,
                rating_value: rating,
                comment,
                created_at: new Date(), 
                user_id: currentUser.id
            });
        }
        this.moderatorRatingSubject.next([...current]);
    }
}