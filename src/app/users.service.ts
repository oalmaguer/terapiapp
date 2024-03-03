import { Injectable, inject } from '@angular/core';
import { Auth, authState, updateProfile, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Firestore,
  collection,
  addDoc,
  documentId,
  getDocs,
  doc,
  collectionData,
  getDoc,
} from '@angular/fire/firestore';
import { User } from '@firebase/auth-types';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
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
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;

  constructor(private afAuth: AngularFireAuth, private firestore: Firestore) {
    this.authStateSubscription = this.authState$.subscribe(
      (aUser: any | null) => {
        //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
        aUser;
      }
    );
  }
  userData$ = new BehaviorSubject<any>(null);
  userIsLoggedIn$ = new BehaviorSubject<any>(false);
  sessionChanges$ = new Subject();

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

  async getUserProfile(user) {
    let data = [];
    const querySnapshot = await getDocs(collection(this.firestore, 'patients'));
    querySnapshot.forEach((doc) => {
      doc.data();
      // doc.data() is never undefined for query doc snapshots
      doc.id, ' => ', doc.data();
      if (doc.id) {
        data.push(doc.data());
      }
    });

    return this.filterUsers(data, user.email);
  }

  filterUsers(users, email) {
    users;
    return users.filter((mail) => mail.email === email);
  }

  sessionChanges() {
    this.sessionChanges$.next(null);
  }
}
