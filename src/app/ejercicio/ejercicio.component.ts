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
  userForm: FormGroup = new FormGroup({});
  ejercicioForm: FormGroup = new FormGroup({});
  doctorId: any;
  hasVideos = false;
  selectedVideoId: any;
  public userVideos: any;
  numbers: number[] = Array.from({ length: 25 }, (value, key) => key + 1);

  userRole: string | null = 'null';
  constructor(
    private supabaseService: SupabaseService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.userForm = new FormGroup({
      patient: new FormControl([], [Validators.required]),
    });

    this.ejercicioForm = new FormGroup({
      series: new FormControl('', [Validators.required]),
      repeticiones: new FormControl('', [Validators.required]),
      comentarios: new FormControl(''),
    });
    this.ejercicioForm.valueChanges.subscribe((elem) => {
      console.log(elem);
      console.log(this.ejercicioForm.valid);
    });
    this.supabaseService.userSupabaseData$.subscribe((elem) => {
      this.user = elem;
      if (this.user) {
        this.getUserVideos(this.user.video);
      }
    });
    this.getPatients();
    this.onChanges();
  }

  async getUserVideos(videos) {
    let userHasVideos = videos;

    if (!this.user) return;
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('videos')
      .list();

    if (error) {
      console.error(error);
      return;
    }

    let removeEmpty = data.filter(
      (elem) => elem.name !== '.emptyFolderPlaceholder'
    );

    let new_array: any = removeEmpty.map((elem, idx) => {
      return {
        ...elem,
        id: elem.name.split('.')[0],
      };
    });
    let newvideos = new_array.filter((elem) => {
      return userHasVideos.includes(parseInt(elem.id));
    });

    if (videos.length == 1 && videos[0] === 1000) {
      this.videos = new_array;
    } else {
      this.videos = newvideos;

      this.hasVideos = this.videos.length > 0;
    }
    this.cd.detectChanges();
  }

  onChanges() {
    this.userForm.get('patient')?.valueChanges.subscribe((id) => {
      this.selectedPatient = this.patients.find((elem) => elem.id == id);
      this.userVideos = this.selectedPatient.video;
    });

    this.ejercicioForm.get('repeticiones')?.valueChanges.subscribe((id) => {
      console.log(id);

      this.cd.detectChanges();
    });

    this.ejercicioForm.get('series')?.valueChanges.subscribe((id) => {
      console.log(id);
      this.cd.detectChanges();
    });

    this.ejercicioForm.get('comentarios')?.valueChanges.subscribe((id) => {
      console.log(id);
    });
  }

  onPatientSelect(id, event) {
    this.selectedPatient = this.patients.find((elem) => elem.id == event);

    this.selectedVideoId = id;
    this.cd.detectChanges();
  }

  getPatients() {
    this.supabaseService.getPatients().then((data) => {
      this.supabaseService.userSupabaseData$
        .pipe(takeUntil(this.destroy$))
        .subscribe((elem) => {
          if (elem) {
            this.userRole = elem.role;
            this.doctorId = elem.doctor;
            this.patients = data.data.filter(
              (elem) => elem.doctor == this.doctorId
            );
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
    return;
    await this.supabaseService.assignVideo(
      this.userVideos,
      parseInt(this.selectedVideoId),
      this.selectedPatient.id
    );
    this.getPatients();
  }

  onEjercicioSelect(numero: number) {
    this.userForm.patchValue({
      patient: this.selectedPatient.id,
    });
  }
}
