import { Injectable, inject } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  first,
} from 'rxjs';
import UserProfileData from './dto/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  isLoggedIn;

  authStateSubscription: Subscription;

  constructor() {}
  // sessionInfo$ = new BehaviorSubject<any>(null);
  userIsLoggedIn$ = new BehaviorSubject<any>(false);
  sessionChanges$ = new Subject();
  imageChanged$ = new Subject();

  getUserData() {
    // return this.sessionInfo$;
  }

  getLoginStatus() {
    return this.isLoggedIn;
  }

  filterUsers(users, email) {
    users;
    return users.filter((mail) => mail.email === email);
  }

  sessionChanges() {
    this.sessionChanges$.next(null);
  }

  imageChangeTrigger() {
    this.imageChanged$.next(null);
  }
}
