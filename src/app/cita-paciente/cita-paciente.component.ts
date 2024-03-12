import { Component } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-cita-paciente',
  templateUrl: './cita-paciente.component.html',
  styleUrls: ['./cita-paciente.component.scss'],
})
export class CitaPacienteComponent {
  patient: any;
  citas: any;
  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.supabaseService.patientData$.subscribe((elem) => {
      if (elem) {
        this.patient = elem;
        this.getPatientAppointment();
      }
    });
    this.supabaseService.getPatients();
  }

  getPatientAppointment() {
    this.supabaseService.getCitasByPatientId(this.patient.id).then((res) => {
      this.citas = res.data;
      this.citas = this.citas.map((cita) => {
        const date = new Date(cita.fecha_inicio);

        // Format the date and time
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${date
          .getHours()
          .toString()
          .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        // Combine the formatted date and time
        const result = `${formattedDate} ${formattedTime}`;
        return {
          ...cita,
          fecha_inicio: result,
        };
      });
      console.log(this.citas);
    });
  }
}
