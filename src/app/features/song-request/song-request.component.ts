import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Track } from '../../shared/models/track.model';
import { SongRequest } from '../../shared/models/songRequest.model';

import { TrackService } from '../../core/services/track.service';
import { SongRequestService } from '../../core/services/song-request.service';

@Component({
  selector: 'app-song-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './song-request.component.html',
  styleUrl: './song-request.component.scss'
})

export class SongRequestComponent {

  tracks: Track[] = [];
  searchTerm: string = '';
  selectedTrack: Track | null = null;
  message: string = '';

  //Statusmeldungen
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private trackService: TrackService, private songRequestService: SongRequestService) {
    this.loadTracks();
  }

  // alle Tracks über Track-Service laden
  private loadTracks(): void {
    this.trackService.getTracks()
      .subscribe(data => {
        this.tracks = data;
      });
  }

  // Tracks nach Benutzerabgabe filtern
  get filteredTracks(): Track[] {

    if (!this.searchTerm || this.selectedTrack) {
      return [];
    }

    const term = this.searchTerm.toLowerCase();

    return this.tracks.filter(track =>
      track.title.toLowerCase().includes(term) || track.artist.toLowerCase().includes(term)
    );

  }

  selectTrack(track: Track) {
    this.selectedTrack = track;

    // optional: Suchfeld füllen
    this.searchTerm = `${track.artist} - ${track.title}`;
  }

  onSearchChange() {
    if (this.selectedTrack) {
      this.selectedTrack = null;
    }
  }

  //Songwunsch-Request absenden
  submitRequest() {

    // Formularvalidierung - Song muss ausgewählt sein
    if (!this.selectedTrack) {
      this.errorMessage = "Bitte zuerst einen Song auswählen.";
      this.successMessage = "";
      return;
    }

    const request: SongRequest = {
      request_id: crypto.randomUUID(),
      track_id: this.selectedTrack.track_id,
      created_at: new Date(),
      user_id: crypto.randomUUID(),
      message: this.message || undefined,
      played: false
    };

    this.songRequestService.addRequest(request);

/*
    // Falls an das echte Backend angebunden
    this.songRequestService.addRequest(request).subscribe({
      next: () => {
        this.successMessage = "Songwunsch erfolgreich gesendet!";
      },
      error: () => {
        this.errorMessage = "Fehler beim Senden.";
      }
    });
*/

    // Testen, ob der State richtig gespeichert wurde in der Browser-Konsole
    console.log("SongRequest erstellt:", request);

    // Erfolgsmeldung anzeigen
    this.successMessage = "Songwunsch erfolgreich gesendet!";
    this.errorMessage = "";

  }

}
