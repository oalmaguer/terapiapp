import { Component, Sanitizer } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.component.html',
  styleUrls: ['./ejercicio.component.scss'],
})
export class EjercicioComponent {
  user: any;
  videoUrl = `https://nllsuanpxktsdayzwsgl.supabase.co/storage/v1/object/public/videos/9/`;
  videos = [];
  constructor(
    private supabaseService: SupabaseService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit() {
    this.supabaseService.userSupabaseData$.subscribe((elem) => {
      this.user = elem;
      this.getUserVideos('carlos');
    });
  }

  getSafeUrl(videoName: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.videoUrl + videoName
    );
  }

  async getUserVideos(doctorName) {
    console.log(doctorName);
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('videos')
      .list(this.user.id + '/');

    if (error) {
      console.error(error);
      return;
    }
    let transform = data.filter(
      (elem) => elem.name !== '.emptyFolderPlaceholder'
    );
    this.videos = transform;
  }

  requestFullscreen(event: Event) {
    const iframe = event.target as HTMLIFrameElement;
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.requestFullscreen) {
      /* IE/Edge */
      iframe.requestFullscreen();
    } else if (iframe.requestFullscreen) {
      /* Firefox */
      iframe.requestFullscreen();
    } else if (iframe.requestFullscreen) {
      /* Chrome, Safari and Opera */
      iframe.requestFullscreen();
    }
  }
}
