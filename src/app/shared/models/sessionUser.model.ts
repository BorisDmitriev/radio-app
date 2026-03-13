export type UserRole = 'listener' | 'moderator';

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
}
