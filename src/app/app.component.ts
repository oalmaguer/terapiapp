import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { SupabaseService } from './supabase.service';
import { Subject, filter, takeUntil, pipe } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userRole: string;
  isLoading = true;
  destroy$ = new Subject<boolean>();
  doctorId: any;
  patients: any[];
  displayMenu = true;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}
  title = 'carlosapp';
  userLoggedIn = false;
  userSession: any;
  showSidebar = true;
  showRespoMenu = false;
  menuState: string = 'false';

  @HostListener('window:resize', []) updateDays() {
    // lg (for laptops and desktops - screens equal to or greater than 1200px wide)
    // md (for small laptops - screens equal to or greater than 992px wide)
    // sm (for tablets - screens equal to or greater than 768px wide)
    // xs (for phones - screens less than 768px wide)

    if (window.innerWidth >= 768) {
      this.showRespoMenu = false; //sm
      this.showSidebar = true; //sm
    } else if (window.innerWidth < 768) {
      this.showRespoMenu = true;
      this.showSidebar = false;
    }
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.displayOrHideSidebar();
    this.supabaseService.sessionInfo$.subscribe((elem) => {
      if (elem && elem !== 'loggedOut') {
        this.userSession = elem;
        this.userLoggedIn = true;
        this.userRole = elem.user.role;
        this.supabaseService.setUserInformation(elem.user);
        this.getPatients();
      } else if (elem === 'loggedOut') {
        this.userSession = null;
        this.userLoggedIn = false;
      }
    });
  }

  displayOrHideSidebar() {
    this.supabaseService.showSidebar$.subscribe((elem) => {
      this.showSidebar = elem;
    });
  }

  getPatients() {
    this.supabaseService.getPatients().then((data) => {
      // GETS ALL THE PATIENTS
      // THEN
      //GETS USER LOGGED INFO TO GET THE DR
      this.supabaseService.userInfo$
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          if (user) {
            this.doctorId = user.doctor;
            this.patients = data.data.filter(
              (user) => user.doctor == this.doctorId
            );
            this.supabaseService.patientsList$.next(this.patients);
          }
        });
    });
  }

  showMenu() {
    this.menuState = this.menuState === 'true' ? 'false' : 'true';
    this.supabaseService.sidebarAnimation$.next(this.menuState);
    this.showSidebar = !this.showSidebar;
    this.supabaseService.showSidebar$.next(this.showSidebar);
  }
}
