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
  itemSelected: any;

  userRole: string | null = 'null';
  private subscription: Subscription = new Subscription();
  @Input() role: string | null = 'null';
  user: any;
  userImage: any;
  imageUrl: any;
  userForm: FormGroup = new FormGroup({});
  displayMenu = true;
  anim = 'out';
  constructor(
    private router: Router,
    private usersService: UsersService,
    private supabaseService: SupabaseService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.imageChanges();
    this.supabaseService.userInfo$.subscribe((elem) => {
      if (elem) {
        this.user = elem;
        this.userRole = elem.role;
        this.getUserImage(this.user);
      }
    });

    this.supabaseService.sidebarAnimation$.subscribe((elem) => {
      this.anim = elem;
    });
  }

  setItem(idx) {
    this.itemSelected = idx;
  }

  showSidebar() {
    this.supabaseService.showSidebar$.next(false);
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
    // this.subscription.unsubscribe();
  }

  logOut() {
    localStorage.clear();

    // this.afAuth.signOut();
    this.router.navigate(['login']);
    this.supabaseService.sessionInfo$.next(null);
    this.supabaseService.patientData$.next(null);
    this.supabaseService.userInfo$.next(null);
    this.supabaseService.signOut();
  }

  showMenu() {
    this.displayMenu = !this.displayMenu;
    this.supabaseService.showSidebar$.next(this.displayMenu);
  }
}
