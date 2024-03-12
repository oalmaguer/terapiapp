import { Injectable, APP_INITIALIZER, NgModule } from '@angular/core';
import { FormArray } from '@angular/forms';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import * as e from 'cors';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supa_client: SupabaseClient;
  public patientData$ = new BehaviorSubject(null);
  public userData$ = new BehaviorSubject(null);

  public patientsList$ = new BehaviorSubject(null);
  public patientsList = this.patientsList$.asObservable();
  constructor() {
    this.supa_client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );

    const { data } = this.supa_client.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          this.userData$.next(session.user);
          const data = this.userInformation(session.user);
          data.then((elem) => {
            this.patientData$.next(elem.data[0]);
          });
        } else if (event === 'SIGNED_OUT') {
          // handle sign out event
        } else if (event === 'PASSWORD_RECOVERY') {
          // handle password recovery event
        } else if (event === 'TOKEN_REFRESHED') {
          // handle token refreshed event
        } else if (event === 'USER_UPDATED') {
          // handle user updated event
        }
      }
    );
  }

  async signUp(email, password: string, phone, name) {
    try {
      let data = await this.supa_client.auth.signUp({ email, password });
      if (data) {
        this.insertProfile({ email, password, phone, name });
      }
      return data;
    } catch (err) {
      return err.toPromise();
    }
  }

  async signOut() {
    let res = this.supa_client.auth.signOut();
  }

  //Login
  login(email, password) {
    return this.supa_client.auth.signInWithPassword({
      email,
      password,
    });
  }

  insertProfile(user) {
    return this.supa_client
      .from('patients')
      .insert({
        name: user.username,
        phone: user.phone,
        email: user.email,
      })
      .then((elem) => {});
  }

  update(user) {
    return this.supa_client
      .from('patients')
      .update({
        email: user.email,
        phone: user.cellphone,
        username: user.username,
      })
      .eq('email', user.email)
      .then((response) => {});
  }

  updateDocInfo(user) {
    return this.supa_client
      .from('doctors')
      .insert({
        email: user.email,
        phone: user.cellphone,
        name: user.name,
        skill: user.skill,
      })
      .then((response) => {});
  }

  obtenerAsignacionesPaciente(pacienteId = 14) {
    return this.supa_client
      .from('asignaciones')
      .select('*')
      .eq('paciente_id', pacienteId);
  }

  async userInformation(user) {
    return await this.supa_client
      .from('patients')
      .select('*')
      .eq('email', user.email);
  }
  async getPatients() {
    return await this.supa_client.from('patients').select('*');
  }

  getSession() {
    return this.supa_client.auth.getSession();
  }

  getStorage() {
    return this.supa_client.storage;
  }

  async removeImage(userId, imageName) {
    //remove image first
    return await this.supa_client.storage
      .from('avatars2')
      .remove([`${userId}/${imageName}`]);
  }

  getSupabaseClient() {
    return this.supa_client;
  }

  getDoctors(doctorId) {
    return this.supa_client.from('doctors').select('*').eq('id', doctorId);
  }

  async writeNote(userId, note) {
    return await this.supa_client
      .from('notes')
      .insert({
        id: userId,
        note: `${note}`,
      })
      .eq('id', userId);
  }

  async getNotes(userId) {
    return await this.supa_client.from('notes').select('*').eq('id', userId);
  }

  async getVideosByFolder(folderId) {
    const { data, error } = await this.supa_client.storage
      .from('videos')
      .list(folderId.name);

    if (error) {
      console.error(error);
    }
    return data;
  }

  async assignVideo(
    userVideos,
    videoId,
    patiendId,
    series,
    repeticiones,
    comentario
  ) {
    let videos = [];
    if (!userVideos) {
      videos = [videoId];
    } else {
      videos = [...userVideos, videoId];
    }

    let rmDup = new Set(videos.map((elem) => parseInt(elem)));

    await this.supa_client.from('asignaciones').insert({
      paciente_id: patiendId,
      video_id: videoId,
      series: series,
      repeticiones: repeticiones,
      comentario: comentario,
    });
    return await this.supa_client
      .from('patients')
      .update([{ video: Array.from(rmDup) }])
      .eq('id', patiendId);
  }

  getCitas() {
    return this.supa_client.from('citas').select('*');
  }

  getCitasById(doctorId) {
    return this.supa_client.from('citas').select('*').eq('doctorId', doctorId);
  }

  getCitasByPatientId(pacienteId) {
    return this.supa_client
      .from('citas')
      .select('*')
      .eq('pacienteId', pacienteId);
  }

  addDate(date, doctorId, patient, description) {
    return this.supa_client.from('citas').insert({
      fecha_inicio: date,
      estado: 1,
      descripcion: description,
      doctorId: doctorId,
      pacienteId: patient.id,
      nombrePaciente: patient.name,
    });
  }

  async getExercises() {}
}
