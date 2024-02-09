import { Injectable, APP_INITIALIZER, NgModule } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';
import { SessionService } from './session.service';
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supa_client: SupabaseClient;
  public userSupabaseData$ = new BehaviorSubject(null);
  public userData$ = new BehaviorSubject(null);
  constructor() {
    this.supa_client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );

    const { data } = this.supa_client.auth.onAuthStateChange(
      (event, session) => {
        console.log(event, session);
        if (event === 'SIGNED_IN') {
          this.userData$.next(session.user);
          const data = this.userInformation(session.user);
          data.then((elem) => {
            this.userSupabaseData$.next(elem.data[0]);
          });
        }
        if (event === 'INITIAL_SESSION') {
          // handle initial session
          this.userData$.next(session.user);
          const data = this.userInformation(session.user);
          data.then((elem) => {
            this.userSupabaseData$.next(elem.data[0]);
          });
        } else if (event === 'SIGNED_IN') {
          // handle sign in event
          this.userData$.next(session.user);
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

  async signUp(email, password: string, phone, username) {
    try {
      let data = await this.supa_client.auth.signUp({ email, password });
      if (data) {
        this.insertProfile({ email, password, phone, username });
      }
      return data;
    } catch (err) {
      console.log('erro: ', err);
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
      .from('users')
      .insert({
        username: user.username,
        phone: user.phone,
        email: user.email,
      })
      .then((elem) => {});
  }

  update(user) {
    return this.supa_client
      .from('users')
      .update({
        email: user.email,
        phone: user.cellphone,
        username: user.username,
      })
      .eq('email', user.email)
      .then((response) => {});
  }

  updateDocInfo(user) {
    console.log(user);
    return this.supa_client
      .from('doctors')
      .insert({
        email: user.email,
        phone: user.cellphone,
        name: user.name,
        skill: user.skill,
      })
      .then((response) => {
        console.log(response);
      });
  }

  async userInformation(user) {
    return await this.supa_client
      .from('users')
      .select('*')
      .eq('email', user.email);
  }

  getSession() {
    return this.supa_client.auth.getSession();
  }

  getStorage() {
    return this.supa_client.storage;
  }

  getSupabaseClient() {
    return this.supa_client;
  }

  getDoctors(doctorId) {
    return this.supa_client.from('doctors').select('*').eq('id', doctorId);
  }

  async getExercises() {}
}
