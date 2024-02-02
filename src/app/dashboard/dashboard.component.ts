import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private usersService: UsersService, public afAuth: AngularFireAuth, private router: Router) { }

  user: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.usersService.getUserData().subscribe((user) => {
      console.log(user)
      this.user = user;
    })

  }

  logOut() {

    localStorage.clear();
    this.afAuth.signOut();
    this.router.navigate(['sign-in']);
    this.usersService.userIsLoggedIn$.next(false);
    this.usersService.isLoggedIn = false;
  }
}
