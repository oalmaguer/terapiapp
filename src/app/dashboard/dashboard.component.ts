import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    private usersService: UsersService,
    public afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  user: any;
  currentUser;
  imageUrl: any;
  imageFile: any;
  successMessage = false;
  ngOnInit(): void {
    this.supabaseService.userSupabaseData$.subscribe((elem) => {
      if (elem) {
        console.log(elem);
        this.user = elem;
        // this.getUserData(this.user);
      }
    });
  }

  getUserData(userData) {
    userData;
    console.log(userData);
    let user = this.supabaseService.userInformation(userData);
    user.then((elem) => {
      this.user = elem.data[0];
      this.getUserImage(this.user);
    });
  }

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
}
