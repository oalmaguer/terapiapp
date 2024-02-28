import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  userRole: string | null = 'null';
  private subscription: Subscription = new Subscription();
  @Input() role: string | null = 'null';

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private usersService: UsersService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    // console.log(this.supabaseService.userRole);
    // this.supabaseService.userSupabaseData$.subscribe((elem) => {
    //   if (elem) {
    //     console.log(elem.role);
    //     this.userRole = elem;
    //     const data = this.supabaseService.userInformation(elem);
    //     console.log
    //   }
    // });
    console.log(this.role);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut() {
    localStorage.clear();
    // this.afAuth.signOut();
    this.router.navigate(['login']);
    this.supabaseService.userData$.next(null);
    this.supabaseService.userSupabaseData$.next(null);
    this.supabaseService.signOut();
  }
}
