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
  showError: boolean = false;

  ngOnInit() {
    this.adminForm = new FormGroup({
      videoName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      video: new FormControl('', [Validators.required]),
    });
    this.supabaseService.patientData$.subscribe((elem) => {
      this.user = elem;
    });

    this.adminForm.get('video').valueChanges.subscribe((elem) => {
      if (elem) {
        let name = elem.split('.')[1];
        name !== 'mp4' ? this.resetVideo() : this.showName();
      }
    });
  }

  showName() {
    this.adminForm.get('videoName').setValue(this.adminForm.get('video').value);
    this.showError = false;
  }

  resetVideo() {
    this.adminForm.get('video').setValue('');
    this.imageFile = null;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 10000);
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

  openFileInput() {
    document.getElementById('fileInput').click();
  }
}
