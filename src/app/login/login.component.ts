import { Component, NgZone,inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private auth: Auth = inject(Auth);

  userForm: FormGroup;
constructor(private formBuilder: FormBuilder, private usersService: UsersService, public afAuth: AngularFireAuth,
  private router: Router
)  {}
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }



  login() {
    console.log()
    this.usersService.login(this.auth, this.userForm.value.username, this.userForm.value.password).then((success) => {

      if (success) {
      this.usersService.userData$.next(success);
        this.router.navigate(['/dashboard']);
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  register() {
    this.usersService.register(this.auth, this.userForm.value.username, this.userForm.value.password).then((success) => {
      console.log(success);
    }).catch((error) => {
      console.log(error);
    })
  }

  onSubmit() {
    console.log(this.userForm.value);
  }
}
