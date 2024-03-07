import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { Subscription, filter } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  userRole: string | null = 'null';
  private subscription: Subscription = new Subscription();
  @Input() role: string | null = 'null';
  user: any;
  userImage: any;
  imageUrl: any;
  userForm: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private usersService: UsersService,
    private supabaseService: SupabaseService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.imageChanges();
    this.supabaseService.userSupabaseData$.subscribe((elem) => {
      if (elem) {
        this.user = elem;
        this.userRole = elem.role;

        this.getUserImage(this.user);
      }
    });
  }

  imageChanges() {
    this.usersService.imageChanged$.subscribe((elem) => {
      this.getUserImage(this.user);
    });
  }

  async getUserImage(user) {
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('avatars2')
      .list(this.user.id + '/');

    if (error) {
      console.error(error);
      return;
    }

    this.imageUrl = `https://nllsuanpxktsdayzwsgl.supabase.co/storage/v1/object/public/avatars2/${user.id}/${data[0].name}`;
    this.userForm.patchValue({
      imageUrl: this.imageUrl,
    });
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
