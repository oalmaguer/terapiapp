import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { BehaviorSubject, Subscription, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isLoggedIn;
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;

  constructor(private afAuth: AngularFireAuth) {
    this.authStateSubscription = this.authState$.subscribe((aUser: any | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
   console.log(aUser);
  })
  }
  userData$ = new BehaviorSubject<any>(null);
  userIsLoggedIn$ = new BehaviorSubject<any>(false);


  getUserData() {
    return this.userData$;
   }

  getLoginStatus() {
    return this.isLoggedIn;
   }


    login(auth, email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  register(auth, email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
}
