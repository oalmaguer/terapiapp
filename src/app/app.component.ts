import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public auth: AngularFireAuth, private router: Router, private usersService: UsersService ){}
  title = 'carlosapp';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.login();
  }
  login() {
    this.auth.authState.subscribe((user) => {
      console.log(user)
      if (user) {
        this.usersService.userIsLoggedIn$.next(true);
        this.usersService.userData$.next(user);
      }
    })
  }

}
