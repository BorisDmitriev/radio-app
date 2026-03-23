import { TestBed } from '@angular/core/testing';
import { SongRequestService } from './song-request.service';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { SongRequest } from '../../shared/models/songRequest.model';

describe('SongRequestService', () => {

  let service: SongRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SongRequestService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SongRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // prüft, ob keine offenen HTTP Requests existieren
  });

  /**
   * Gruppierung und Count testen
   */
  it('should group song requests by track_id and calculate count', () => {

    const mockRequests: SongRequest[] = [
      { request_id: '1', track_id: 'A', created_at: new Date('2026-01-01'), user_id: 'user-1', played: false },
      { request_id: '2', track_id: 'A', created_at: new Date('2026-01-02'), user_id: 'user-2', played: false },
      { request_id: '3', track_id: 'B', created_at: new Date('2026-01-03'), user_id: 'user-3', played: false }
    ];

    service.loadSongRequests();

    // HTTP-Request abfangen
    const req = httpMock.expectOne('assets/mock-data/songRequest.json');
    req.flush(mockRequests); // Gib dem HTTP-Request unsere 3 Test-Mock-Daten als Antwort zurück

    const result: SongRequest[] = (service as any).allSongRequestsSubject.getValue();

    // Im Ergebniss sollen 2 Einträge nach der Gruppierung übrig bleiben (Tracks mit der ID 'A' werden gruppiert)
    expect(result.length).toBe(2); 

    // Hat Track A wirklich count = 2?
    const trackA = result.find(r => r.track_id === 'A');
    expect(trackA).toBeTruthy();
    expect(trackA!.count).toBe(2);
  });


  /**
   * Wird played korrekt auf true gesetzt?
   */
  it('should mark a request as played', () => {

    const mockRequests: SongRequest[] = [
      { request_id: '1', track_id: 'A', created_at: new Date(), user_id: 'user-1', played: false }
    ];

    (service as any).allSongRequestsSubject.next(mockRequests);

    service.markAsPlayed('1');

    const result = (service as any).allSongRequestsSubject.getValue();

    expect(result[0].played).toBeTrue();
  });

});