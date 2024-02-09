import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private usersService: UsersService,
    private supabaseService: SupabaseService
  ) {}

  logOut() {
    localStorage.clear();
    // this.afAuth.signOut();
    this.router.navigate(['login']);
    this.supabaseService.userData$.next(null);
    this.supabaseService.userSupabaseData$.next(null);
    this.supabaseService.signOut();
  }
}
