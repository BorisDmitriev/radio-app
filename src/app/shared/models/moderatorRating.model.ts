export interface User {
  moderator_rating_id: string; // UUID
  rating_value: number;
  comment: string;
  created_at: Date;
  moderator_id: string // UUID
  user_id: string // UUID
}