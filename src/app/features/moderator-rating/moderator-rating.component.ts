import { Component } from '@angular/core';
import { ModeratorView } from '../../shared/models/moderator.model';
import { ModeratorService } from '../../core/services/moderator.service';
import { map } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';
import { ModeratorRatingView } from '../../shared/models/moderatorRating.model';
import { ModeratorRatingService } from '../../core/services/moderator-rating.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-moderator-rating',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './moderator-rating.component.html',
  styleUrl: './moderator-rating.component.scss'
})
export class ModeratorRatingComponent {
readonly moderators$;
  readonly ratings$;

  constructor(
    private readonly moderatorService: ModeratorService,
    private readonly moderatorRatingService: ModeratorRatingService, 
    private readonly dialog: MatDialog,
    private authService: AuthService
  ) {
    this.moderators$ = this.moderatorService.moderator$.pipe(
      map(moderators =>
        moderators.map(p => ({
          moderator_id: p.moderator_id, 
          name: p.name
        }))
      )
    );
    this.ratings$ = this.moderatorRatingService.moderatorRatings$;
  }

  openRatingDialog(moderator: ModeratorView) {
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      alert('Einloggen erforderlich');
      return;
    }

    const existingRating = this.moderatorRatingService.getModeratorRatingView().find(r => 
      r.moderator_id === moderator.moderator_id &&
      r.user_id === currentUser.id
    )
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      width: '400px', 
      data: {
        moderator,
        rating: existingRating?.rating_value || 0, 
        comment: existingRating?.comment || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => { 
      if (result) {
        this.moderatorRatingService.addRating(
          moderator.moderator_id,
          result.rating,
          result.comment
        );
      }
    });
  }

  getRatingForModerator(moderator: ModeratorView, ratings: ModeratorRatingView[]): number {
    const ratingObj = ratings.find(
      r => r.moderator_id === moderator.moderator_id
    );
    return ratingObj?.rating_value || 0;
  }
}
