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
    const expectedRoles = next.data.title;

    if (this.sessionStore) {
      return true;
    }
    this.supabaseService.getSession().then((elem) => {
      this.supabaseService.sessionInfo$.next(elem.data.session);

      if (elem?.data.session) {
        this.sessionStore = elem.data.session;
        if (expectedRoles === 'login') {
          this.router.navigate(['/dashboard']);
        }
        // User is authenticated, allow access
        return true; // elem is authenticated, allow access
      } else {
        this.router.navigate(['/login']);
        return false; // User is not authenticated, prevent access and redirect to login
      }
    });
  }

  isLoggedIn(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.sessionStore) {
      return false;
    }
    return true;
  }

  userStatus() {
    this.usersService.userIsLoggedIn$.subscribe((aUser: any | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      aUser;
    });
  }
}
