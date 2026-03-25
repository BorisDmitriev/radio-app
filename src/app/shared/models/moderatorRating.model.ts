export interface ModeratorRating {
  moderator_rating_id: string; // UUID
  rating_value: number;
  comment: string;
  created_at: Date;
  moderator_id: string // UUID
  user_id: string // UUID
}

export interface ModeratorRatingView {
  moderator_rating_id: string; 
  rating_value: number;
  comment: string;
  created_at: Date;
  moderator_id: string 
  user_id: string 
}