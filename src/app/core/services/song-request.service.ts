import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SongRequest } from '../../shared/models/songRequest.model';

@Injectable({
    providedIn: 'root'
})

export class SongRequestService {

    constructor(private http: HttpClient) { }

    /**
     * Songwunsch-Senden
     */
    // aktueller gesendeter Wunsch
    private requestSubject = new BehaviorSubject<SongRequest | null>(null);

    request$ = this.requestSubject.asObservable();

    //schreibt nicht in die JSON-Datei, sondern nur in der App-State -> Da kein echtes Backend wird das Speichern nur simuliert
    addRequest(request: SongRequest): void {
        this.requestSubject.next(request);

/*
        // Falls an das echte Backend angebunden
        addRequest(request: SongRequest): Observable<SongRequest> {
            return this.http.post<SongRequest>(
                'http://localhost:3000/song-requests',
                request
            );
        }
*/
    }


    /**
     * Songwünsche Einsehen
     */

    // Liste aller Wünsche für die Markierung eines Songs als "played" als BehaviorSubject-Objekt
    private allSongRequestsSubject = new BehaviorSubject<SongRequest[]>([]);

    allSongRequestsSubject$ = this.allSongRequestsSubject.asObservable();

    loadSongRequests(): void {
        this.http
            .get<SongRequest[]>('assets/mock-data/songRequest.json')
            .subscribe(data => {

                // Songwünsche nach Datum sortieren. 
                const sortedRequests = [...data].sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );

                // Songwünsche nach track_id gruppieren
                const groupedRequests: { [trackId: string]: SongRequest } = {};

                sortedRequests.forEach(request => { // groupedRequests bauen

                    if (!groupedRequests[request.track_id]) {
                        groupedRequests[request.track_id] = { ...request, count: 1 };
                    } else {
                        groupedRequests[request.track_id].count!++;
                    }

                });

                // Im result sind gleiche Songwünsche gruppiert; created_at entspricht durch Vorsortierung dem neuesten Wunsch
                const result = Object.values(groupedRequests);

                // Vorsortierte und Gruppierte Songwünsche speichern
                this.allSongRequestsSubject.next(result);
            });
    }

    // Songs als gespielt markieren -> nur in der App-State, keine Änderung der Mock-Daten
    markAsPlayed(requestId: string): void {

        const requests = this.allSongRequestsSubject.getValue();

        const updatedRequests = requests.map(request =>
            request.request_id === requestId
                ? { ...request, played: true }
                : request
        );

        this.allSongRequestsSubject.next(updatedRequests);

    }

}
