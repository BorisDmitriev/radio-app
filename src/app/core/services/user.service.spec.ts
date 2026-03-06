import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../../shared/models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
  });

  it('sollte erstellt werden können', () => {
    expect(service).toBeTruthy();
  });

  it('sollte die initialen Benutzer aus den Mockdaten laden', async () => {
    const users = await firstValueFrom(service.users$);

    expect(users).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
  });

  it('sollte einen neuen Benutzer hinzufügen', async () => {
    const before = await firstValueFrom(service.users$);

    service.addUser('Neuer Benutzer');

    const after = await firstValueFrom(service.users$);

    expect(after.length).toBe(before.length + 1);

    const added: User = after[after.length - 1];
    expect(added.name).toBe('Neuer Benutzer');
    expect(added.user_id).toBeTruthy();
    expect(typeof added.user_id).toBe('string');
  });

  it('sollte einen Benutzer anhand der ID entfernen', async () => {
    service.addUser('Zu löschen');

    const withAdded = await firstValueFrom(service.users$);
    const added = withAdded.find(u => u.name === 'Zu löschen');

    expect(added).toBeDefined();

    const idToDelete = added!.user_id;

    service.removeUser(idToDelete);

    const afterRemove = await firstValueFrom(service.users$);

    expect(afterRemove.some(u => u.user_id === idToDelete)).toBeFalse();
    expect(afterRemove.some(u => u.name === 'Zu löschen')).toBeFalse();
  });

  it('sollte keine Änderung vornehmen, wenn eine unbekannte ID entfernt wird', async () => {
    const before = await firstValueFrom(service.users$);

    service.removeUser('does-not-exist');

    const after = await firstValueFrom(service.users$);

    expect(after).toEqual(before);
  });
});
