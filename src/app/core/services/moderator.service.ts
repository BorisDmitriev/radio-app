import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import moderatorSeed from '../../../assets/mock-data/moderator.json';
import { Moderator, ModeratorView } from '../../shared/models/moderator.model';

@Injectable({
  providedIn: 'root',
})
export class ModeratorService {
  private readonly moderators = moderatorSeed as Moderator[];
  private readonly moderatorSubject = new BehaviorSubject<Moderator[]>(
    this.moderators
  );

  readonly moderator$ = this.moderatorSubject.asObservable();

    resetModeratorsForTest(moderators: Moderator[] = []) {
      this.moderatorSubject.next([...moderators]); 
    }

  getModeratorView(): ModeratorView[] {
    return this.moderatorSubject.value.map(p => ({
      moderator_id: p.moderator_id,   
      name: p.name
    }));
  }
}