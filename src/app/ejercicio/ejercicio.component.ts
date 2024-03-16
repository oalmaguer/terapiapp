import { ChangeDetectorRef, Component, Sanitizer } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.component.html',
  styleUrls: ['./ejercicio.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('.2s ease-out', style({ height: 300, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 300, opacity: 1 }),
        animate('.2s ease', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
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
  activeFieldset: string | null = null;
  showInfo = false;
  userRole: string | null = 'null';
  videoSelected;
  visible: boolean;
  openToast: any;
  loading = false;
  constructor(
    private supabaseService: SupabaseService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
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
    this.supabaseService.userInfo$.subscribe((elem) => {
      this.user = elem;
      if (this.user) {
        this.userRole = this.user.role;
        this.getUserVideos(this.user.video);
      }
    });
    this.getPatients();
    this.onChanges();
    this.numbers = this.numbers.map((elem) => {
      return { name: elem } as any;
    });
  }

  setActiveField(fieldsetId: string) {
    this.activeFieldset =
      this.activeFieldset === fieldsetId ? null : fieldsetId;
  }

  showUserInfo() {
    this.showInfo = !this.showInfo;
  }

  isFieldsetActive(fieldsetId: string) {
    return this.activeFieldset === fieldsetId;
  }

  selectVideo(id) {
    if (this.videoSelected == id) {
      this.videoSelected = null;
      return;
    }

    this.videoSelected = id;
  }

  async getUserVideos(videos) {
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
        url: this.sanitizer.bypassSecurityTrustResourceUrl(
          this.videoUrl + elem.name
        ),
      };
    });

    if (this.user.role == 'doctor' || this.user.role == 'admin') {
      this.videos = new_array;
      return;
    }

    let newvideos = new_array.filter((elem) => {
      return videos.includes(elem.name.split('.')[0]);
    });

    if (videos.length == 1 && videos[0] === 1000) {
      this.videos = new_array;
    } else {
      this.videos = newvideos;

      this.hasVideos = this.videos.length > 0;
    }

    this.addExerciseInfo();
  }

  addExerciseInfo() {
    this.supabaseService.obtenerAsignacionesPaciente().then((data) => {
      let asignaciones = data.data;
      asignaciones.forEach((asignacion) => {
        this.videos = this.videos.map((video) => {
          if (video.id == asignacion.video_id) {
            video.repeticiones = asignacion.repeticiones;
            video.series = asignacion.series;
            video.comentario = asignacion.comentario;
            video.fecha = asignacion.created_at;
          }
          return video;
        });
      });
    });
  }

  onChanges() {
    this.userForm.get('patient')?.valueChanges.subscribe((user) => {
      this.selectedPatient = user;
      this.userVideos = this.selectedPatient.video;
    });

    this.ejercicioForm.get('repeticiones')?.valueChanges.subscribe((id) => {});

    this.ejercicioForm.get('series')?.valueChanges.subscribe((id) => {});

    this.ejercicioForm.get('comentarios')?.valueChanges.subscribe((id) => {});
  }

  onPatientSelect(id, event) {
    this.selectedPatient = this.patients.find((elem) => elem.id == event);
    this.selectedVideoId = id;
  }

  getPatients() {
    this.supabaseService.patientsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((elem) => {
        if (elem) {
          this.patients = elem;
          this.doctorId = this.user.doctor;
          console.log(this.user);
          this.patients = this.patients.filter(
            (patient) => patient.id !== this.user.id
          );
          console.log(this.patients);
        }
      });
  }

  getSafeUrl(videoName: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.videoUrl + videoName
    );
  }

  showDialog() {
    this.visible = !this.visible;
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

  async assignVideo() {
    this.loading = true;

    await this.supabaseService
      .assignVideo(
        this.userVideos,
        this.videoSelected,
        this.selectedPatient.id,
        this.ejercicioForm.value.series,
        this.ejercicioForm.value.repeticiones,
        this.ejercicioForm.value.comentarios
      )
      .then((resp) => {
        if (resp.status === 204) {
          console.log('resp: ', resp);
          this.showToast(true);
        } else {
          this.showToast(false);
        }
        this.loading = false;
      });

    this.getPatients();
  }

  onEjercicioSelect(numero: number) {
    this.userForm.patchValue({
      patient: this.selectedPatient.id,
    });
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
