import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Listener erfolgreich einloggen', () => {
    const result = service.loginAsListener('Lukas');

    expect(result).toBeTrue();
    expect(service.currentUser?.name).toBe('Lukas');
    expect(service.currentUser?.role).toBe('listener');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('sollte Listener Login ablehnen wenn Name leer ist', () => {
    const result = service.loginAsListener('   ');

    expect(result).toBeFalse();
    expect(service.currentUser).toBeNull();
  });

  it('sollte Moderator erfolgreich einloggen', () => {
    const result = service.loginAsModerator('Laura', 'radio123');

    if (result) {
      expect(service.currentUser?.role).toBe('moderator');
      expect(service.currentUser?.name).toBe('Laura');
    }
  });

  it('sollte Moderator Login ablehnen bei falschem Passwort', () => {
    const result = service.loginAsModerator('Laura', 'falsch');

    expect(result).toBeFalse();
    expect(service.currentUser).toBeNull();
  });

  it('sollte Logout durchführen', () => {
    service.loginAsListener('Lukas');

    service.logout();

    expect(service.currentUser).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('sollte Rolle korrekt prüfen', () => {
    service.loginAsListener('Lukas');

    expect(service.hasRole('listener')).toBeTrue();
    expect(service.hasRole('moderator')).toBeFalse();
  });

  it('sollte Session aus localStorage laden', () => {
    const storedUser = {
      id: '123',
      name: 'Lukas',
      role: 'listener',
    };

    localStorage.setItem('radio-app-session', JSON.stringify(storedUser));

    const newService = new AuthService();

    expect(newService.currentUser?.name).toBe('Lukas');
    expect(newService.currentUser?.role).toBe('listener');
  });
});
