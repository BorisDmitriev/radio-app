export interface PlaylistEntry {
  playlist_entry_id: string; 
  playlist_id: string;      
  track_id: string;          
  added_at: string; // speichert wann der Song zur Playlist hinzugefügt wurde        
  position: number; // Position des Songs in der Playlist      
}