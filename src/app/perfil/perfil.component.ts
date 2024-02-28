import { Component } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { UsersService } from '../users.service';
import { doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService
  ) {}
  user: any;
  currentUser;
  imageUrl: any;
  imageFile: any;
  successMessage = false;
  userDoctor = '';

  ngOnInit() {
    this.supabaseService.userSupabaseData$.subscribe((elem) => {
      if (elem) {
        this.user = elem;
        this.getUserImage(this.user);
        this.getUserDoctors(this.user.doctor);
      }
    });
  }

  getUserDoctors(doctorId) {
    this.supabaseService.getDoctors(doctorId).then((doctor) => {
      if (doctor.data.length > 0) {
        console.log(doctor);
        this.userDoctor = doctor.data[0].name;
      } else {
        this.userDoctor = 'No tiene doctor asignado';
      }
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
