import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { SupabaseService } from './supabase.service';
import { Subject, filter, takeUntil, pipe } from 'rxjs';

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

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}
  title = 'carlosapp';
  userLoggedIn = false;
  userSession: any;
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.supabaseService.sessionInfo$.subscribe((elem) => {
      if (elem) {
        this.userSession = elem;
        this.userLoggedIn = true;
        this.userRole = elem.user.role;
        this.supabaseService.setUserInformation(elem.user);
        this.getPatients();
      }
    });
  }

  getPatients() {
    console.log('get patients');
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
}
