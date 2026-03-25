import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ModeratorDashboardService } from './moderator-dashboard.service';

describe('ModeratorDashboardService', () => {

    let service: ModeratorDashboardService;

    beforeEach(() => {  // wird vor jedem Test ausgeführt
        TestBed.configureTestingModule({ // Testumgebung mit Abhängigkeiten bereitstellen
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(ModeratorDashboardService);
    });

    // Service muss existieren
    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    /**
     * Unittests für Moderator-Bewertungen
     */
    describe('Moderator ratings', () => {
        
        // Durchschnittsbewertung eines Moderators richtig ausrechnen
        it('should calculate average rating correctly', () => {
            const mockRatings = [
                {
                    moderator_rating_id: '1',
                    rating_value: 5,
                    comment: 'Test',
                    created_at: new Date(),
                    moderator_id: 'test-moderator-1',
                    user_id: 'test-user-1'
                },
                {
                    moderator_rating_id: '2',
                    rating_value: 3,
                    comment: 'Test',
                    created_at: new Date(),
                    moderator_id: 'test-moderator-1',
                    user_id: 'test-user-2'
                }
            ];

            // "service as any" - ignoriert die TypeScript-Sichtbarkeit (private)
            (service as any).ratings = mockRatings;
            (service as any).selectedModeratorId = 'test-moderator-1';

            (service as any).emitStats();

            const stats = (service as any).statsSubject.getValue();

            expect(stats.averageRating).toBe(4);
        });

        // Wenn mehr als 5 Moderator-Bewertungen existieren, werden nur die 5 neuesten angezeigt
        it('should return only 5 latest ratings', () => {
            const mockRatings = [
                { moderator_rating_id: '1', rating_value: 5, comment: 'A', created_at: new Date(), moderator_id: 'test-moderator-1', user_id: 'test-user-1' },
                { moderator_rating_id: '2', rating_value: 4, comment: 'B', created_at: new Date(), moderator_id: 'test-moderator-1', user_id: 'test-user-2' },
                { moderator_rating_id: '3', rating_value: 3, comment: 'C', created_at: new Date(), moderator_id: 'test-moderator-1', user_id: 'test-user-3' },
                { moderator_rating_id: '4', rating_value: 5, comment: 'D', created_at: new Date(), moderator_id: 'test-moderator-1', user_id: 'test-user-4' },
                { moderator_rating_id: '5', rating_value: 2, comment: 'E', created_at: new Date(), moderator_id: 'test-moderator-1', user_id: 'test-user-5' },
                { moderator_rating_id: '6', rating_value: 1, comment: 'F', created_at: new Date(), moderator_id: 'test-moderator-1', user_id: 'test-user-6' },
                { moderator_rating_id: '7', rating_value: 4, comment: 'G', created_at: new Date(), moderator_id: 'test-moderator-1', user_id: 'test-user-7' }
            ];

            (service as any).ratings = mockRatings;
            (service as any).selectedModeratorId = 'test-moderator-1';

            (service as any).emitStats();

            const stats = (service as any).statsSubject.getValue();

            expect(stats.latestRatings.length).toBe(5);
        });

        //Wenn ein bestimmter Moderator mit einer bestimmten ID gewählt wird, werden nur Bewertungen dieses Moderators verwendet (testet Filter-Funktionalität)
        it('should filter ratings by selected moderator', () => {
            const mockRatings = [
                {
                    moderator_rating_id: '1',
                    rating_value: 5,
                    comment: 'A',
                    created_at: new Date(),
                    moderator_id: 'test-moderator-1',
                    user_id: 'test-user-1'
                },
                {
                    moderator_rating_id: '2',
                    rating_value: 3,
                    comment: 'B',
                    created_at: new Date(),
                    moderator_id: 'test-moderator-1',
                    user_id: 'test-user-2'
                },
                {
                    moderator_rating_id: '3',
                    rating_value: 4,
                    comment: 'C',
                    created_at: new Date(),
                    moderator_id: 'test-moderator-2',
                    user_id: 'test-user-3'
                }
            ];

            (service as any).ratings = mockRatings;
            (service as any).selectedModeratorId = 'test-moderator-1';

            (service as any).emitStats();

            const stats = (service as any).statsSubject.getValue();

            expect(stats.voteCount).toBe(2);

        });
    });


    /**
     * Unittests für Playlist-Bewertungen
     */
    describe('Playlist ratings', () => {

        // Durchschnittsbewertung einer Playlist richtig ausrechnen
        it('should calculate playlist average rating correctly', () => {
            const mockPlaylistRatings = [
                {
                    playlist_rating_id: '1',
                    rating_value: 5,
                    comment: 'Test',
                    created_at: new Date(),
                    playlist_id: 'playlist-1',
                    user_id: 'user-1'
                },
                {
                    playlist_rating_id: '2',
                    rating_value: 3,
                    comment: 'Test',
                    created_at: new Date(),
                    playlist_id: 'playlist-1',
                    user_id: 'user-2'
                }
            ];

            (service as any).playlistRatings = mockPlaylistRatings;
            (service as any).selectedPlaylistId = 'playlist-1';

            (service as any).emitPlaylistsStats();

            const stats = (service as any).playlistStatsSubject.getValue();

            expect(stats.averageRating).toBe(4);

        });

        // Wenn mehr als 5 Playlist-Bewertungen existieren, werden nur die 5 neuesten angezeigt
        it('should return only 5 latest playlist ratings', () => {
            const mockPlaylistRatings = [
                { playlist_rating_id: '1', rating_value: 5, comment: 'A', created_at: new Date(), playlist_id: 'playlist-1', user_id: 'u1' },
                { playlist_rating_id: '2', rating_value: 4, comment: 'B', created_at: new Date(), playlist_id: 'playlist-1', user_id: 'u2' },
                { playlist_rating_id: '3', rating_value: 3, comment: 'C', created_at: new Date(), playlist_id: 'playlist-1', user_id: 'u3' },
                { playlist_rating_id: '4', rating_value: 5, comment: 'D', created_at: new Date(), playlist_id: 'playlist-1', user_id: 'u4' },
                { playlist_rating_id: '5', rating_value: 2, comment: 'E', created_at: new Date(), playlist_id: 'playlist-1', user_id: 'u5' },
                { playlist_rating_id: '6', rating_value: 1, comment: 'F', created_at: new Date(), playlist_id: 'playlist-1', user_id: 'u6' },
                { playlist_rating_id: '7', rating_value: 4, comment: 'G', created_at: new Date(), playlist_id: 'playlist-1', user_id: 'u7' }
            ];

            (service as any).playlistRatings = mockPlaylistRatings;
            (service as any).selectedPlaylistId = 'playlist-1';

            (service as any).emitPlaylistsStats();

            const stats = (service as any).playlistStatsSubject.getValue();

            expect(stats.latestRatings.length).toBe(5);

        });

        //Wenn eine bestimmte Playlist mit einer bestimmten ID im Dropdown-Menü gewählt wird, werden nur Bewertungen dieser Playlist verwendet
        it('should filter ratings by selected playlist', () => {
            const mockPlaylistRatings = [
                {
                    playlist_rating_id: '1',
                    rating_value: 5,
                    comment: 'A',
                    created_at: new Date(),
                    playlist_id: 'playlist-1',
                    user_id: 'user-1'
                },
                {
                    playlist_rating_id: '2',
                    rating_value: 3,
                    comment: 'B',
                    created_at: new Date(),
                    playlist_id: 'playlist-1',
                    user_id: 'user-2'
                },
                {
                    playlist_rating_id: '3',
                    rating_value: 4,
                    comment: 'C',
                    created_at: new Date(),
                    playlist_id: 'playlist-2',
                    user_id: 'user-3'
                }
            ];

            (service as any).playlistRatings = mockPlaylistRatings;
            (service as any).selectedPlaylistId = 'playlist-1';

            (service as any).emitPlaylistsStats();

            const stats = (service as any).playlistStatsSubject.getValue();

            expect(stats.voteCount).toBe(2);

        });
    });

});
