import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environment/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionData: any;
  private supa_client: any;

  sessionData$ = new BehaviorSubject(null);
  constructor(private supabase: SupabaseService) {
    // this.supa_client = createClient(
    //   environment.supabase.url,
    //   environment.supabase.key
    // );
    // this.supa_client.auth.onAuthStateChange((event, session) => {
    //   console.log(session);
    //   if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION ') {
    //     // Fetch session data using the session object
    //     this.sessionData = session.user;
    //     this.sessionData$.next(session.user);
    //   } else {
    //     this.sessionData = null;
    //     this.sessionData$.next(null);
    //   }
    // });
  }

  // getSessionData() {
  //   return this.sessionData$;
  // }
}
