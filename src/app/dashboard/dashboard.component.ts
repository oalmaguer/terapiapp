import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  user: any;
  currentUser;
  imageUrl: any;
  imageFile: any;
  successMessage = false;
  userRole: string;
  destroy$ = new Subject<boolean>();
  doctorId: any;
  patients: any[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}
  ngOnInit(): void {
    this.supabaseService.userInfo$.subscribe((user) => {
      // this.user = user.data[0];

      if (user) {
        this.user = user;
        this.userRole = user.role;
        this.getPatients();
      }
    });
  }

  // getUserData(userData) {
  //   let user = this.supabaseService.userInfo$.subscribe((userInfo) => {
  //
  //     this.user = userInfo.data[0];
  //     this.getUserImage(this.user);
  //   });
  // }

  async uploadImage() {
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('avatars2')
      .upload(`${this.user.id}/avatar_${Date.now()}.png`, this.imageFile);

    if (error) {
      console.error(error);
      return;
    }
    this.successMessage = true;
    setTimeout(() => {
      this.successMessage = false;
    }, 3000);
    // this.imageUrl.value = URL.createObjectURL(this.imageFile);
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
  }

  async onImageSelected(event) {
    this.imageFile = event.target.files[0];
    const file = event.target.files[0];
    if (!file) return;
    this.imageUrl = URL.createObjectURL(file);

    // showOverlay.value = true;
  }

  getPatients() {
    this.supabaseService.patientsList$.subscribe((data) => {
      if (data) {
        this.patients = data;
      }
    });
  }

  onPatientSelect(patient) {
    this.router.navigate(['/notas', { patient: patient }]);
  }
}
