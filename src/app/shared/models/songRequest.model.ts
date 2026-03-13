export interface SongRequest {
  request_id: string; // UUID
  track_id: string; 
  created_at: Date;
  user_id: string //UUID
}