import { ModeratorRatingService } from './moderator-rating.service';
import { ModeratorRating } from '../../shared/models/moderatorRating.model';

describe('ModeratorRatingService', () => {
  let service: ModeratorRatingService;
  let mockAuthService: { currentUser: {id: string; name: string; role: string } | null }

  function createMockModeratorRatings(): ModeratorRating[] {
    return [{
      moderator_rating_id: '1', 
      moderator_id: '1', 
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

    service = new ModeratorRatingService(mockAuthService as any); 

    service.resetRatingsForTest([]); 
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Moderator-Bewertungen korrekt liefern', () => {
    const mock = createMockModeratorRatings(); 

    service.resetRatingsForTest(mock); 

    const result = service.getModeratorRatingView();

    expect(result).toEqual([{
      moderator_rating_id: '1', 
      moderator_id: '1', 
      rating_value: 3,
      comment: 'Test', 
      created_at: mock[0].created_at, 
      user_id: '1'
    }])
  });

  it('sollte Bewertungen hinzufügen', () => {
    service.addRating('1', 1, 'Bewertung'); 

    const result = service.getModeratorRatingView(); 

    expect(result.length).toBe(1); 
  }); 

  it('sollte Bewertungen aktualisieren', () => {
    service.resetRatingsForTest(createMockModeratorRatings()); 
    service.addRating('1', 5, 'Update'); 

    const result = service.getModeratorRatingView(); 

    expect(result[0].rating_value).toBe(5); 
    expect(result[0].comment).toBe('Update'); 
  }); 

  it('sollte keine Bewertung hinzufügen, wenn der Nutzer nicht angemeldet ist', () => {
    mockAuthService.currentUser = null; 

    service.addRating('1', 5, 'Test'); 

    const result = service.getModeratorRatingView(); 

    expect(result.length).toBe(0);
  }); 
});