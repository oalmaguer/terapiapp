import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, first, map, take, tap } from 'rxjs';
import { UsersService } from 'src/app/users.service';
import { SupabaseService } from 'src/app/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  sessionStore: any;
  constructor(
    public router: Router,
    private usersService: UsersService,
    private supabaseService: SupabaseService
  ) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    console.log('entra al can activate');

    if (this.sessionStore) {
      return true;
    }
    this.supabaseService.getSession().then((elem) => {
      this.supabaseService.sessionInfo$.next(elem.data.session);
      console.log(elem);
      if (elem?.data.session.user.role === 'authenticated') {
        this.sessionStore = elem.data.session;
        // User is authenticated, allow access
        return true; // elem is authenticated, allow access
      } else {
        this.router.navigate(['/login']);
        return false; // User is not authenticated, prevent access and redirect to login
      }
    });
  }

  userStatus() {
    console.log('checking login');

    this.usersService.userIsLoggedIn$.subscribe((aUser: any | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      aUser;
    });
  }
}
