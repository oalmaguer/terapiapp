import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EjercicioComponent } from './ejercicio/ejercicio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterDoctorsComponent } from './register-doctors/register-doctors.component';
import { NotasComponent } from './notas/notas.component';
import { CitasComponent } from './citas/citas.component';
import { CitaPacienteComponent } from './cita-paciente/cita-paciente.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'register', component: RegisterComponent },
  {
    path: 'registerDoctors',
    component: RegisterDoctorsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ejercicios',
    component: EjercicioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notas',
    component: NotasComponent,
    canActivate: [AuthGuard],
  },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'citas', component: CitasComponent, canActivate: [AuthGuard] },
  {
    path: 'citaPaciente',
    component: CitaPacienteComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
