import { ChangeDetectorRef, Component, Sanitizer } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.component.html',
  styleUrls: ['./ejercicio.component.scss'],
})
export class EjercicioComponent {
  user: any;
  videoUrl = `https://nllsuanpxktsdayzwsgl.supabase.co/storage/v1/object/public/videos/`;
  videos = [];
  patients = [];
  selectedPatient: any;
  destroy$ = new Subject<boolean>();
  adminForm: FormGroup = new FormGroup({});
  doctorId: any;
  hasVideos = false;
  selectedVideoId: any;
  public userVideos: any;

  constructor(
    private supabaseService: SupabaseService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.adminForm = new FormGroup({
      patient: new FormControl([], [Validators.required]),
    });
    this.supabaseService.userSupabaseData$.subscribe((elem) => {
      this.user = elem;
      console.log(this.user);
      this.getUserVideos(this.user.video);
    });
    this.getPatients();
    this.onChanges();
  }

  async getUserVideos(videoId) {
    console.log(videoId);
    let userHasVideos = videoId;
    if (!this.user) return;
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('videos')
      .list();

    console.log(this.user);
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
    let removeEmpty = data.filter(
      (elem) => elem.name !== '.emptyFolderPlaceholder'
    );

    let new_array: any = removeEmpty.map((elem, idx) => {
      return {
        ...elem,
        id: elem.name.split('.')[0],
      };
    });
    console.log(new_array);
    let newvideos = new_array.filter((elem) => {
      return userHasVideos.includes(parseInt(elem.id));
    });
    this.videos = newvideos;
    console.log(this.videos);
    this.hasVideos = this.videos.length > 0;
    this.cd.detectChanges();
  }

  onChanges() {
    this.adminForm.get('patient')?.valueChanges.subscribe((id) => {
      this.selectedPatient = this.patients.find((elem) => elem.id == id);
      console.log(this.selectedPatient);
      this.userVideos = this.selectedPatient.video;
      console.log(this.userVideos);
      this.cd.detectChanges();
    });
  }

  onPatientSelect(id, event) {
    this.selectedPatient = this.patients.find((elem) => elem.id == event);

    this.selectedVideoId = id;
    this.cd.detectChanges();
    console.log(id);
    console.log(event);
  }

  getPatients() {
    this.supabaseService.getPatients().then((data) => {
      this.supabaseService.userSupabaseData$
        .pipe(takeUntil(this.destroy$))
        .subscribe((elem) => {
          if (elem) {
            this.doctorId = elem.doctor;
            this.patients = data.data.filter(
              (elem) => elem.doctor == this.doctorId
            );
            console.log(this.patients);
          }
        });
    });
  }

  getSafeUrl(videoName: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.videoUrl + videoName
    );
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

  async assignVideo(id, patient) {
    console.log(id, patient);
    await this.supabaseService.assignVideo(
      this.userVideos,
      parseInt(this.selectedVideoId),
      this.selectedPatient.id
    );
    this.getPatients();
  }
}
