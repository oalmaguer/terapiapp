import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, first, map, take, tap } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from 'src/app/users.service';
import { SupabaseService } from 'src/app/supabase.service';
import { SessionService } from 'src/app/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    public afAuth: AngularFireAuth,
    private usersService: UsersService,
    private supabaseService: SupabaseService,
    private sessionService: SessionService
  ) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.supabaseService.userData$.subscribe((elem) => {
      console.log(elem);
      if (elem?.role === 'authenticated') {
        return true; // elem is authenticated, allow access
      } else {
        this.router.navigate(['/login']);
        return false; // User is not authenticated, prevent access and redirect to login
      }
    });
  }

  async checkLogin() {
    const user = this.supabaseService.getSupabaseClient().auth.getUser();
    let hasUser = false;
    if (user) {
      // User is authenticated, allow access
      user.then((elem) => {
        console.log(elem);
        console.log(elem);
        this.usersService.userData$.next(elem);
        hasUser = true;
      });
    } else {
      // Redirect to the login page if the user is not authenticated

      this.router.navigate(['/login']);
    }
    return hasUser;
  }

  userStatus() {
    this.usersService.userIsLoggedIn$.subscribe((aUser: any | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      aUser;
    });
  }
}
