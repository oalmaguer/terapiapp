import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { SupabaseService } from './supabase.service';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private usersService: UsersService,
    private supabaseService: SupabaseService,
    private sessionService: SessionService
  ) {
    this.login();
  }
  title = 'carlosapp';
  userLoggedIn = false;
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.supabaseService.userData$.subscribe((elem) => {
      elem;
      console.log(elem);
      this.userLoggedIn = elem;
    });
  }
  login() {
    // const user = this.supabaseService.getSession().then((session) => session);
    // user.then((data: any) => {
    //   console.log(data.data.user);
    //   if (data.data.user) {
    //     this.usersService.userData$.next(data.data.user);
    //     this.supabaseService.userInformation(data.data.user).then((elem) => {
    //       console.log(elem);
    //       this.supabaseService.userSupabaseData$.next(elem.data[0]);
    //     });
    //     return true; // elem is authenticated, allow access
    //   } else {
    //     this.router.navigate(['/login']);
    //     return false; // User is not authenticated, prevent access and redirect to login
    //   }
    // });
  }
}
