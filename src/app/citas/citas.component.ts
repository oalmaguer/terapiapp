import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { CalendarOption } from '@fullcalendar/angular/private-types';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent {
  form: FormGroup;
  defaultDate: Date;
  citas: any;
  fechasBloqueadas: Date[] = [];
  calendarOptions: any;
  minDate = new Date();
  showSetDate = false;
  selectedCalendarDate: any;
  selectedHour: any;
  disableBtn = true;
  patients: any;
  user: any;
  eventInfo: any;
  showDateModal = false;
  dateValid = true;
  hours = [
    { name: '14:00:00' },
    { name: '14:30:00' },
    { name: '15:00:00' },
    { name: '15:30:00' },
    { name: '16:00:00' },
    { name: '16:30:00' },
    { name: '17:00:00' },
    { name: '17:30:00' },
    { name: '18:00:00' },
    { name: '18:30:00' },
    { name: '19:00:00' },
    { name: '19:30:00' },
    { name: '20:00:00' },
    { name: '20:30:00' },
    { name: '21:00:00' },
    { name: '21:30:00' },
  ];
  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.supabaseService.patientData$.subscribe((elem) => {
      if (elem) {
        this.user = elem;
        this.getCitas();
      }
    });
    // this.getCitas();
    this.defaultDate = new Date(); // Set the date to today
    this.defaultDate.setHours(16, 0, 0, 0); // Set the time to 7:00 am
    this.form = new FormGroup({
      date: new FormControl(this.defaultDate, [Validators.required]),
      hour: new FormControl(null, [Validators.required]),
      patient: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });

    this.calendarOptions = {
      initialView: 'dayGridMonth',

      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      dateClick: (arg) => this.calendarClicked(arg),
      eventClick: (arg) => {
        this.openDialog(
          arg.event.title,
          arg.event.start,
          arg.event.extendedProps.description
        );
      },
      validRange: {
        start: this.minDate,
      },
      editable: true,
      selectable: true,
      allDay: false,
      // eventClick: (arg) => {
      //   console.log(arg);
      // },
    };
    this.supabaseService.patientsList$.subscribe((elem) => {
      if (elem) {
        this.patients = elem;
        // this.processCitasForCalendar();
      }
    });

    this.form.valueChanges.subscribe((value) => {});
  }

  openDialog(title, start, description) {
    const inputDate = new Date(start);
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = inputDate.getFullYear().toString().slice(-2); // Get last two digits of the year
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');

    const outputDate = `${day}/${month}/${year}`;
    const hour = `${hours}:${minutes}`;
    this.eventInfo = {
      title: title.replace(/:/g, ' '),
      date: outputDate,
      hour: hour,
      description: description,
    };
    this.showDateModal = true;
  }

  onHourSelect(hour) {
    this.selectedHour = hour.name;
    let formatHour =
      this.selectedCalendarDate.dateStr + 'T' + this.selectedHour;
    let hourOcuppied = this.citas.filter((cita) => {
      return cita.fecha_inicio == formatHour;
    });
    console.log(hourOcuppied);
    if (hourOcuppied && hourOcuppied.length > 0) {
      this.disableBtn = true;
      this.dateValid = false;
    } else {
      this.disableBtn = false;
      this.dateValid = true;
    }
  }

  onPatientSelect(patient) {
    this.disableBtn = !this.form.valid;
  }

  calendarClicked(event) {
    this.selectedCalendarDate = event;
    this.showSetDate = true;
  }

  getCitas() {
    this.supabaseService
      .getCitasById(parseInt(this.user.doctor))
      .then((response) => {
        if (response) {
          this.citas = response.data;
          this.processCitasForCalendar();
        }
      });
  }

  processCitasForCalendar() {
    const citasProcesadas = this.citas.map((cita) => {
      return {
        ...cita,
        fecha_inicio: new Date(cita.fecha_inicio),
        fecha_fin: new Date(cita.fecha_fin),
      };
    });
    this.actualizarFechasBloqueadas();
  }

  actualizarFechasBloqueadas() {
    this.fechasBloqueadas = this.citas.map((cita) => {
      return {
        title: `Cita con: ${cita.nombrePaciente}`,
        start: cita.fecha_inicio,
        description: cita.descripcion,
        allDay: false,
      };
    });

    this.calendarOptions.events = this.fechasBloqueadas;

    // Aquí, simplemente estamos tomando la fecha de inicio de cada cita para bloquearla.
    // Podrías necesitar lógica adicional si, por ejemplo, quieres bloquear rangos de fechas.
  }

  onClose() {
    this.form.reset();
    this.form.get('date').setValue(this.defaultDate);
    this.showSetDate = false;
  }

  setDate() {
    if (this.form.valid) {
      this.supabaseService
        .addDate(
          this.selectedCalendarDate.dateStr + 'T' + this.selectedHour,
          this.user.doctor,
          this.form.value.patient,
          this.form.value.description
        )
        .then((response) => {});
    }
  }
}
