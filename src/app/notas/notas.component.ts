import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Subject, takeUntil } from 'rxjs';

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

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.supabaseService.userSupabaseData$.subscribe((user) => {
      console.log(user);
      if (user) {
        this.userRole = user.role;
        this.getNotes(user.id);
      }
    });
    this.adminForm = new FormGroup({
      patient: new FormControl([], [Validators.required]),
      note: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
    this.getPatients();
    this.onChanges();
  }

  onChanges() {
    this.adminForm.get('patient')?.valueChanges.subscribe((id) => {
      this.selectedPatient = this.patients.find((elem) => elem.id == id);
      console.log(this.selectedPatient);
      this.getUserImage(this.selectedPatient);
    });
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

  async getUserImage(user) {
    console.log(user);
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
        console.log(data);
        if (data.data.length > 0) {
          // this.adminForm.get('note')?.setValue(data.data[0].note);
          this.patientNotes = data.data;
        }
      });
  }

  onSubmit() {
    console.log(this.selectedPatient.id);
    this.supabaseService
      .writeNote(this.selectedPatient.id, this.adminForm.get('note')?.value)
      .then((data) => {
        console.log(data);
        // if (data.data.length > 0) {
        //   this.supabaseService
        //     .updateNote({
        //       id: data.data[0].id,
        //       note: this.adminForm.get('note')?.value,
        //     })
        //     .then((elem) => {
        //       console.log(elem);
        //     });
        // } else {
        //   this.supabaseService
        //     .insertNote({
        //       note: this.adminForm.get('note')?.value,
        //       patient: this.selectedPatient.id,
        //     })
        //     .then((elem) => {
        //       console.log(elem);
        //     });
        // }
      });
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }
}
