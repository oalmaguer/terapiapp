import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { SupabaseService } from './supabase.service';
import { Subject, filter, takeUntil } from 'rxjs';

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
      this.getPatients();
    });
  }

  getPatients() {
    this.supabaseService.getPatients().then((data) => {
      this.supabaseService.patientData$
        .pipe(takeUntil(this.destroy$))
        .subscribe((elem) => {
          if (elem) {
            this.doctorId = elem.doctor;
            this.patients = data.data.filter(
              (elem) => elem.doctor == this.doctorId
            );
          }
          this.supabaseService.patientsList$.next(this.patients);
        });
    });
  }
}
