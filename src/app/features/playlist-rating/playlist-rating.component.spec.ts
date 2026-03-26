import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PlaylistRatingComponent } from './playlist-rating.component';
import { firstValueFrom, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistService } from '../../core/services/playlist.service';
import { PlaylistRatingService } from '../../core/services/playlist-rating.service';
import { AuthService } from '../../core/services/auth.service';

describe('PlaylistRatingComponent', () => {
  let component: PlaylistRatingComponent;
  let fixture: ComponentFixture<PlaylistRatingComponent>;
  let mockPlaylistService: any; 
  let mockPlaylistRatingService: any; 
  let mockAuthService: any; 
  let mockDialog: any; 

  beforeEach(async () => {
    mockPlaylistService = {
      playlist$: of([{ playlist_id: '1', name: 'Test', description: 'Test', created_at: new Date('2026-01-04') }])
    }; 
    mockPlaylistRatingService = {
      playlistRatings$: of([]), 
      getPlaylistRatingView: jasmine.createSpy().and.returnValue([]), 
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
      imports: [PlaylistRatingComponent], 
      providers: [
        { provide: PlaylistService, useValue: mockPlaylistService }, 
        { provide: PlaylistRatingService, useValue: mockPlaylistRatingService }, 
        { provide: AuthService, useValue: mockAuthService }, 
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sollte Playlists liefern', async() => {
    const playlists = await firstValueFrom(component.playlists$); 
    
    expect(playlists.length).toBeGreaterThan(0); 
    expect(playlists[0].playlist_id).toBe('1');
  }); 

  it('sollte 0 zurückgeben, wenn keine Bewertung vorhanden ist', () => {
    const rating = component.getRatingForPlaylist(
      { playlist_id: '1', name: '', description: '', created_at: '2026-03-09' }, 
      []
    ); 

    expect(rating).toBe(0); 
  }); 

  it('sollte den Rating-Dialog öffnen', fakeAsync(() => {
    const playlist = {playlist_id: '1', name: 'Test', description: '', created_at: '2026-08-04'}
    component.openRatingDialog(playlist); 
    tick(); 

    expect(mockDialog.open).toHaveBeenCalled(); 
    expect(mockPlaylistRatingService.addRating).toHaveBeenCalledWith('1', 5, 'Kommentar'); 
  })); 

  it('sollte die Bewertung nicht weiterleiten, wenn kein Nutzer eingeloggt ist', () => {
    mockAuthService.currentUser = null; 
    spyOn(window, 'alert'); 
    const playlist = { playlist_id: '1', name: 'Test', description: '', created_at: '2026-01-01' };  
    component.openRatingDialog(playlist);  

    expect(window.alert).toHaveBeenCalledWith('Einloggen erforderlich'); 
  }); 
});
