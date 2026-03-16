import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import moderatorsSeed from '../../../assets/mock-data/moderator.json';

export type UserRole = 'listener' | 'moderator';

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
}

interface ModeratorAccount {
  moderator_id: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'radio-app-session';

  private readonly currentUserSubject = new BehaviorSubject<SessionUser | null>(
    this.loadSession()
  );

  readonly currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): SessionUser | null {
    return this.currentUserSubject.value;
  }

  loginAsListener(name: string): boolean {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return false;
    }

    const user: SessionUser = {
      id: crypto.randomUUID(),
      name: trimmedName,
      role: 'listener',
    };

    this.setSession(user);
    return true;
  }

  loginAsModerator(name: string, password: string): boolean {
    const moderator = (moderatorsSeed as ModeratorAccount[]).find(
      account =>
        account.name === name.trim() &&
        account.password === password
    );

    if (!moderator) {
      return false;
    }

    const user: SessionUser = {
      id: moderator.moderator_id,
      name: moderator.name,
      role: 'moderator',
    };

    this.setSession(user);
    return true;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  private setSession(user: SessionUser): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private loadSession(): SessionUser | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : null;
  }
}
