import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { SupabaseService } from './supabase.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userRole: string;
  isLoading = true;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private usersService: UsersService,
    private supabaseService: SupabaseService
  ) {}
  title = 'carlosapp';
  userLoggedIn = false;
  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.supabaseService.userData$.subscribe((elem) => {
      this.userLoggedIn = elem;
      if (elem) {
        this.supabaseService.userInformation(elem).then((user) => {
          this.userRole = user.data[0];
        });
      }
    });
  }
}
