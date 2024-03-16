import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(
    private supabaseService: SupabaseService,
    private messageService: MessageService
  ) {}
  adminForm: FormGroup;
  user;
  imageFile: any;
  showError: boolean = false;
  successMessage: boolean = false;
  loading: boolean = false;

  ngOnInit() {
    this.adminForm = new FormGroup({
      videoName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      video: new FormControl('', [Validators.required]),
    });
    this.supabaseService.userInfo$.subscribe((elem) => {
      this.user = elem;
    });

    this.adminForm.get('video').valueChanges.subscribe((elem) => {
      if (elem) {
        console.log(elem);
        let idx = elem.lastIndexOf('.');
        let name = elem.slice(idx + 1);
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
    this.loading = true;
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('videos')
      .upload(`${name}_${Date.now()}.mp4`, this.imageFile);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      this.loading = false;
      this.showToast(true);
    } else {
      this.loading = false;
      this.showToast(false);
    }
  }

  openFileInput() {
    document.getElementById('fileInput').click();
  }

  showToast(status) {
    if (status) {
      this.messageService.add({
        severity: 'success',
        summary: 'Asignación exitosa',
        detail: 'Tu video ha sido asignado con exito',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Ha ocurrido un error',
        detail: 'Vuelve a intentarlo',
      });
    }
  }
}
