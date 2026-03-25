import { PlaylistRatingService } from './playlist-rating.service';
import { PlaylistRating } from '../../shared/models/playlistRating.model';

describe('PlaylistRatingService', () => {
  let service: PlaylistRatingService;
  let mockAuthService: { currentUser: {id: string; name: string; role: string } | null }

  function createMockPlaylistRatings(): PlaylistRating[] {
    return [{
      playlist_rating_id: '1', 
      playlist_id: '1', 
      rating_value: 3,
      comment: 'Test', 
      created_at: new Date('2026-02-02'), 
      user_id: '1'
    }]; 
  }; 

  beforeEach(() => {
    mockAuthService = {
      currentUser: {
        id: '1', 
        name: 'Test-User', 
        role: 'listener'
      }
    }; 

    service = new PlaylistRatingService(mockAuthService as any); 

    service.resetRatingsForTest([]); 
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Playlist-Bewertungen korrekt liefern', () => {
    const mock = createMockPlaylistRatings(); 

    service.resetRatingsForTest(mock); 

    const result = service.getPlaylistRatingView();

    expect(result).toEqual([{
      playlist_rating_id: '1', 
      playlist_id: '1', 
      rating_value: 3,
      comment: 'Test', 
      created_at: mock[0].created_at, 
      user_id: '1'
    }])
  });

  it('sollte Bewertungen hinzufügen', () => {
    service.addRating('1', 1, 'Bewertung'); 

    const result = service.getPlaylistRatingView(); 

    expect(result.length).toBe(1); 
  }); 

  it('sollte Bewertungen aktualisieren', () => {
    service.resetRatingsForTest(createMockPlaylistRatings()); 
    service.addRating('1', 5, 'Update'); 

    const result = service.getPlaylistRatingView(); 

    expect(result[0].rating_value).toBe(5); 
    expect(result[0].comment).toBe('Update'); 
  }); 

  it('sollte keine Bewertung hinzufügen, wenn der Nutzer nicht angemeldet ist', () => {
    mockAuthService.currentUser = null; 

    service.addRating('1', 5, 'Test'); 

    const result = service.getPlaylistRatingView(); 

    expect(result.length).toBe(0);
  }); 
});