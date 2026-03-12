export interface SongRequest {
  request_id: string; // UUID
  requested_title: string;
  requested_artist: string;
  created_at: Date;
  user_id: string //UUID
}