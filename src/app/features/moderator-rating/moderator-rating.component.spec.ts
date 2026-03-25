import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModeratorRatingComponent } from './moderator-rating.component';
import { firstValueFrom, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModeratorService } from '../../core/services/moderator.service';
import { ModeratorRatingService } from '../../core/services/moderator-rating.service';
import { AuthService } from '../../core/services/auth.service';

describe('ModeratorRatingComponent', () => {
  let component: ModeratorRatingComponent;
  let fixture: ComponentFixture<ModeratorRatingComponent>;
  let mockModeratorService: any; 
  let mockModeratorRatingService: any; 
  let mockAuthService: any; 
  let mockDialog: any; 

  beforeEach(async () => {
    mockModeratorService = {
      moderator$: of([{ moderator_id: '1', name: 'Test', description: 'Test', created_at: new Date('2026-01-04') }])
    }; 
    mockModeratorRatingService = {
      moderatorRatings$: of([]), 
      getModeratorRatingView: jasmine.createSpy().and.returnValue([]), 
      addRating: jasmine.createSpy()
    }; 
    mockAuthService = {
      currentUser: {id: '1', name: 'Test-User', role: 'listener' }
    }; 
    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of({ rating: 5, comment: 'Kommentar' })
      })
    }; 

    await TestBed.configureTestingModule({
      imports: [ModeratorRatingComponent], 
      providers: [
        { provide: ModeratorService, useValue: mockModeratorService }, 
        { provide: ModeratorRatingService, useValue: mockModeratorRatingService }, 
        { provide: AuthService, useValue: mockAuthService }, 
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sollte Moderatoren liefern', async() => {
    const moderators = await firstValueFrom(component.moderators$); 
    
    expect(moderators.length).toBeGreaterThan(0); 
    expect(moderators[0].moderator_id).toBe('1');
  }); 

  it('sollte 0 zurückgeben, wenn keine Bewertung vorhanden ist', () => {
    const rating = component.getRatingForModerator(
      { moderator_id: '1', name: '' }, 
      []
    ); 

    expect(rating).toBe(0); 
  }); 

  it('sollte den Rating-Dialog öffnen', fakeAsync(() => {
    const moderator = {moderator_id: '1', name: 'Test', description: '', created_at: '2026-08-04'}
    component.openRatingDialog(moderator); 
    tick(); 

    expect(mockDialog.open).toHaveBeenCalled(); 
    expect(mockModeratorRatingService.addRating).toHaveBeenCalledWith('1', 5, 'Kommentar'); 
  })); 

  it('sollte die Bewertung nicht weiterleiten, wenn kein Nutzer eingeloggt ist', () => {
    mockAuthService.currentUser = null; 
    spyOn(window, 'alert'); 
    const moderator = { moderator_id: '1', name: 'Test', description: '', created_at: '2026-01-01' };  
    component.openRatingDialog(moderator);  

    expect(window.alert).toHaveBeenCalledWith('Einloggen erforderlich'); 
  }); 
});
