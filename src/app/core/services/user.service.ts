import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../shared/models/user.model';
import usersSeed from '../../../assets/mock-data/users.json';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class UserService {

  private usersSubject = new BehaviorSubject<User[]>([...usersSeed]);
  users$ = this.usersSubject.asObservable();

  private get users(): User[] {
    return this.usersSubject.value;
  }

  addUser(name: string): void {
    const newUser: User = {
      user_id: uuidv4(),
      name
    };

    this.usersSubject.next([...this.users, newUser]);
  }

  removeUser(userId: string): void {
    const updatedUsers = this.users.filter(user => user.user_id !== userId);
    this.usersSubject.next(updatedUsers);
  }
}
