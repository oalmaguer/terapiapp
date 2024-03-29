import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RegisterComponent } from './register/register.component';
import { EjercicioComponent } from './ejercicio/ejercicio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminComponent } from './admin/admin.component';
import { SupabaseService } from './supabase.service';
import { RegisterDoctorsComponent } from './register-doctors/register-doctors.component';
import { NotasComponent } from './notas/notas.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CitasComponent } from './citas/citas.component';
import { CalendarModule } from 'primeng/calendar';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { CitaPacienteComponent } from './cita-paciente/cita-paciente.component';
import { DataViewModule } from 'primeng/dataview';
import { MenuResponsiveComponent } from './menu-responsive/menu-responsive.component';
import { AssistantComponent } from './assistant/assistant.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    RegisterComponent,
    EjercicioComponent,
    PerfilComponent,
    AdminComponent,
    RegisterDoctorsComponent,
    NotasComponent,
    CitasComponent,
    CitaPacienteComponent,
    MenuResponsiveComponent,
    AssistantComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    DropdownModule,
    BrowserAnimationsModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    RouterModule,
    DialogModule,
    FullCalendarModule,
    InputTextareaModule,
    DividerModule,
    DataViewModule,
    HttpClientModule,
    ToastModule,
  ],
  providers: [
    SupabaseService,
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSupabase,
      deps: [SupabaseService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function initializeSupabase(supabaseService: SupabaseService) {
  return () => supabaseService.getSession();
}
