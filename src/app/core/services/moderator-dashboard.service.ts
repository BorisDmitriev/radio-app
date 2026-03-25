import { Injectable } from '@angular/core'; // diese Klasse ist ein Service und darf per Dependency Injection verwendet werden
import { BehaviorSubject } from 'rxjs'; // BehaviorSubject ist ein spezieller RxJS-Typ (speichert einen aktuellen Wert)
import { ModeratorRating } from '../../shared/models/moderatorRating.model';
import { PlaylistRating } from '../../shared/models/playlistRating.model';
import { HttpClient } from '@angular/common/http';

export interface DashboardStats<T> {
    averageRating: number;
    voteCount: number;
    latestRatings: T[];
}

export interface Moderator {
    moderator_id: string;
    name: string;
}

export interface Playlist {
    playlist_id: string;
    name: string;
}

@Injectable({   // Angular registriert diesen Service global für die ganze App
    providedIn: 'root',
})

export class ModeratorDashboardService {

    /**
     * Logik für Moderator-Bewertung
     */

    private ratings: ModeratorRating[] = [];
    private selectedModeratorId: string | null = null;

    // Speichert Moderatoren für das Dropdown-Menü
    private moderatorsSubject = new BehaviorSubject<Moderator[]>([]);

    // Speichert aufbereitete Dashboard-Daten
    private statsSubject = new BehaviorSubject<DashboardStats<ModeratorRating>>(
        // initiale Werte
        {
            averageRating: 0,
            voteCount: 0,
            latestRatings: []
        }
    );

    stats$ = this.statsSubject.asObservable();  // Daten dürfen gelesen oder abonniert werden, aber nicht außerhalb des Services verändert werden
    moderators$ = this.moderatorsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadRatings();
        this.loadModerators();

        this.loadPlaylistRatings();
        this.loadPlaylists();
    }

    // GET-API-Request für Moderator-Bewertungen
    private loadRatings(): void {
        this.http
            .get<ModeratorRating[]>('assets/mock-data/moderatorRating.json') // .get liefert ein Observable
            .subscribe((data) => {
                this.ratings = data.map((rating) => (
                    {
                        ...rating,
                        created_at: new Date(rating.created_at), // Umwandlung zum JavaScript Date Objekt fürs spätere Sortieren
                    }
                ));

                this.emitStats();
            });
    }

    // GET-API-Request für Moderatoren für die Dropdown-Liste 
    private loadModerators(): void {
        this.http
            .get<Moderator[]>('assets/mock-data/moderator.json')
            .subscribe((data) => {
                this.moderatorsSubject.next(data);

                if (data.length > 0) {
                    this.selectedModeratorId = data[0].moderator_id;  // setzt default Moderator für das Dropdown-Menü
                    this.emitStats();
                }
            });
    }

    // bereitet die Dashboard-Daten aus den Rohdaten auf
    private buildStats(): DashboardStats<ModeratorRating> {

        // wenn Moderator gewählt - nur Bewertungen dieses Moderators
        const filteredRatingsById = this.selectedModeratorId
            ? this.ratings.filter(r => r.moderator_id === this.selectedModeratorId)
            : this.ratings;

        // Anzahl der Bewertungen im Array
        const voteCount = filteredRatingsById.length;

        // Durchschnitt berechnen
        const averageRating =
            voteCount === 0
                ? 0 // wenn keine Bewertung im Array, dann ist der Durchschnitt gleich Null
                : Number(
                    (
                        filteredRatingsById.reduce((sum, rating) => sum + rating.rating_value, 0) / voteCount
                    ).toFixed(1)  // .toFixed liefert den Wert vom Typ String zurück, deswegen soll dieser Wert mit Number() gecasten werden
                );

        // neueste Bewertungen bestimmen
        const latestRatings = [...filteredRatingsById]
            .sort(   // nach Datum absteigend sortieren
                (a, b) => b.created_at.getTime() - a.created_at.getTime()
            )
            .slice(0, 5); // 5 neueste Bewertungen

        return {
            averageRating,
            voteCount,
            latestRatings,
        };
    }

    private emitStats(): void {
        this.statsSubject.next(this.buildStats());  // .next() speichert Dashboard-Daten als aktuellen Wert
    }

    setModerator(moderatorId: string) {
        this.selectedModeratorId = moderatorId;
        this.emitStats();
    }



    /**
     * Logik für Playlist-Bewertung
     */

    private playlistRatings: PlaylistRating[] = [];
    private selectedPlaylistId: string | null = null;

    // Speichert Playlists für das Dropdown-Menü
    private playlistsSubject = new BehaviorSubject<Playlist[]>([]);

    // Speichert aufbereitete Dashboard-Daten für Playlists
    private playlistStatsSubject = new BehaviorSubject<DashboardStats<PlaylistRating>>(
        // initiale Werte
        {
            averageRating: 0,
            voteCount: 0,
            latestRatings: []
        }
    );
    
    playlists$ = this.playlistsSubject.asObservable();
    playlistStats$ = this.playlistStatsSubject.asObservable();

    // GET-API-Request für Playlist-Bewertungen
    private loadPlaylistRatings(): void {
        this.http
            .get<PlaylistRating[]>('assets/mock-data/playlistRating.json') // .get liefert ein Observable
            .subscribe((data) => {
                this.playlistRatings = data.map((playlist) => (
                    {
                        ...playlist,
                        created_at: new Date(playlist.created_at), // Umwandlung zum JavaScript Date Date-Objekt fürs spätere Sortieren
                    }
                ));

                this.emitPlaylistsStats();
            });
    }

    // GET-API-Request für Moderatoren für die Dropdown-Liste 
    private loadPlaylists(): void {
        this.http
            .get<Playlist[]>('assets/mock-data/playlist.json')
            .subscribe((data) => {
                this.playlistsSubject.next(data);

                if (data.length > 0) {
                    this.selectedPlaylistId = data[0].playlist_id;
                    this.emitPlaylistsStats();
                }
            });
    }

    // bereitet die Dashboard-Daten aus den Rohdaten auf
    private buildPlaylistsStats(): DashboardStats<PlaylistRating> {

        // wenn Playlist gewählt - nur Bewertungen dieser Playlist
        const filteredRatingsById = this.selectedPlaylistId
            ? this.playlistRatings.filter(p => p.playlist_id === this.selectedPlaylistId)
            : this.playlistRatings;

        // Anzahl der Bewertungen im Array
        const voteCount = filteredRatingsById.length;

        // Durchschnitt berechnen
        const averageRating =
            voteCount === 0
                ? 0 // wenn keine Bewertung im Array, dann ist der Durchschnitt gleich Null
                : Number(
                    (
                        filteredRatingsById.reduce((sum, rating) => sum + rating.rating_value, 0) / voteCount
                    ).toFixed(1)
                );

        // neueste Bewertungen bestimmen
        const latestRatings = [...filteredRatingsById]
            .sort(   // nach Datum absteigend sortieren
                (a, b) => b.created_at.getTime() - a.created_at.getTime()
            )
            .slice(0, 5); // 5 neueste Bewertungen

        return {
            averageRating,
            voteCount,
            latestRatings,
        };
    }

    private emitPlaylistsStats(): void {
        this.playlistStatsSubject.next(this.buildPlaylistsStats());  // .next() speichert Dashboard-Daten als aktuellen Wert
    }

    setPlaylist(playlistID: string) {
        this.selectedPlaylistId = playlistID;
        this.emitPlaylistsStats();
    }

}