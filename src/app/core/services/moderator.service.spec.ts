import { ModeratorService } from './moderator.service';
import { Moderator } from '../../shared/models/moderator.model';

describe('ModeratorService', () => {
  let service: ModeratorService;

    const mockModerators: Moderator[] = [{
      moderator_id: '1', 
      name: 'Test'
    }]; 

  beforeEach(() => {
    service = new ModeratorService();
    service.resetModeratorsForTest(mockModerators); 
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Moderatoren korrekt liefern', () => {
    
    const result = service.getModeratorView();

    expect(result).toEqual([{
      moderator_id: '1', 
      name: 'Test'
    }]); 
  });
});