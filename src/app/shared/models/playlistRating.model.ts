export interface User {
  playlist_rating_id: string; // UUID
  playlist_id: string; // UUID
  rating_value: number;
  comment: string; 
  created_at: Date;
  user_id: string; // UUID
}