import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(
    private supabaseService: SupabaseService,
    private userService: UsersService
  ) {}
  adminForm: FormGroup;
  user;
  imageFile: any;

  ngOnInit() {
    this.adminForm = new FormGroup({
      videoName: new FormControl('', [Validators.required, Validators.email]),
    });
    this.supabaseService.userSupabaseData$.subscribe((elem) => {
      this.user = elem;
    });
  }

  onSubmit() {}

  async onVideoSelected(event) {
    this.imageFile = event.target.files[0];
    const file = event.target.files[0];
    if (!file) return;
    // this.imageUrl = URL.createObjectURL(file);

    // showOverlay.value = true;
  }

  async onUpload(name: string) {
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('videos')
      .upload(`${this.user.id}/${name}_${Date.now()}.mp4`, this.imageFile);

    if (error) {
      console.error(error);
      return;
    }
    // this.successMessage = true;
    // setTimeout(() => {
    //   this.successMessage = false;
    // }, 3000);
  }
}
