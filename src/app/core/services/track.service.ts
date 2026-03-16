import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Track } from '../../shared/models/track.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class TrackService {

    constructor(private http: HttpClient) { }

    // gibt den Array mit allen Tracks als Observable an die Komponente zurück
    getTracks(): Observable<Track[]> {
        return this.http.get<Track[]>('assets/mock-data/track.json');
    }

}
