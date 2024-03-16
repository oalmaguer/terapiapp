import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss'],
})
export class NotasComponent {
  adminForm: FormGroup = new FormGroup({});
  patients = [];
  selectedPatient: any;
  patientImageUrl: any;
  doctorId: any;
  destroy$ = new Subject<boolean>();
  patientNotes: any;
  userRole: string | null = 'null';
  user: any;
  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.supabaseService.userInfo$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userRole = user.role;
        if (this.userRole == 'patient') {
          this.loadPatientNotes();
        }
      }
    });
    this.adminForm = new FormGroup({
      patient: new FormControl([], [Validators.required]),
      note: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
    this.onChanges();
    this.getPatients();
  }

  loadPatientNotes() {
    this.supabaseService.getNotes(this.user.id).then((data) => {
      this.patientNotes = data.data;
    });
  }

  onChanges() {
    this.adminForm.get('patient')?.valueChanges.subscribe((patient) => {
      if (!patient) return;
      this.selectedPatient = this.patients.find(
        (elem) => elem.id == patient.id
      );
      if (this.selectedPatient) {
        this.getNotes();
        this.getUserImage(this.selectedPatient);
      }
    });
  }

  getPatients() {
    this.supabaseService.patientsList$.subscribe((data) => {
      if (data) {
        this.patients = data;
        this.setUserIfParam();
      }
    });
  }

  setUserIfParam() {
    this.route.params.subscribe((params) => {
      if (params['patient']) {
        let patient = this.patients.find(
          (elem) => elem.email == params['patient']
        );
        this.adminForm.get('patient')?.setValue(patient);
      }
    });
  }

  async getUserImage(user) {
    const { data, error } = await this.supabaseService
      .getStorage()
      .from('avatars2')
      .list(user.id + '/');

    if (error) {
      console.error(error);
      return;
    }
    this.patientImageUrl = null;

    this.patientImageUrl = `https://nllsuanpxktsdayzwsgl.supabase.co/storage/v1/object/public/avatars2/${user.id}/${data[0].name}`;
    this.getNotes();
  }

  getNotes(userId?) {
    this.supabaseService
      .getNotes(userId ? userId : this.selectedPatient.id)
      .then((data) => {
        if (data.data) {
          // this.adminForm.get('note')?.setValue(data.data[0].note);
          this.patientNotes = data.data;
        }
      });
  }

  onSubmit() {
    this.supabaseService
      .writeNote(this.selectedPatient.id, this.adminForm.get('note')?.value)
      .then((data) => {
        if (data) {
          this.getNotes(this.selectedPatient.id);
        }
        // if (data.data.length > 0) {
        //   this.supabaseService
        //     .updateNote({
        //       id: data.data[0].id,
        //       note: this.adminForm.get('note')?.value,
        //     })
        //     .then((elem) => {
        //
        //     });
        // } else {
        //   this.supabaseService
        //     .insertNote({
        //       note: this.adminForm.get('note')?.value,
        //       patient: this.selectedPatient.id,
        //     })
        //     .then((elem) => {
        //
        //     });
        // }
      });
  }

  ngOnDestroy() {
    // this.destroy$.unsubscribe();
  }
}
