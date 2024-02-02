import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, first, map, take } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from 'src/app/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router, public afAuth: AngularFireAuth, private usersService: UsersService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    this.usersService.userIsLoggedIn$.pipe(map(user => {
      console.log(user);
      if (!user) {
        this.router.navigate(['sign-in']);
        return false;
      }
      this.router.navigate(['dashboard']);
      return true;
    }) )

    return true;
  }

  userStatus() {
    this.usersService.userIsLoggedIn$.subscribe((aUser: any | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      console.log(aUser);
    })
  }

}
