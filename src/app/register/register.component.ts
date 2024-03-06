import { Component, inject } from '@angular/core';
import { UsersService } from '../users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import UserProfileData from '../dto/user.interface';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  userForm: FormGroup;
  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      cellphone: ['', Validators.required],
    });
  }
  register() {
    this.supabaseService
      .signUp(
        this.userForm.value.email,
        this.userForm.value.password,
        this.userForm.value.cellphone,
        this.userForm.value.name
      )
      .then((elem) => {
        this.update();
        this.router.navigate(['dashboard']);
      })
      .catch((err) => {});
    // this.usersService
    //   .register(
    //     this.auth,
    //     this.userForm.value.email,
    //     this.userForm.value.password
    //   )
    //   .then((success) => {
    //
    //     this.setProfile();
    //   })
    //   .catch((error) => {
    //
    //   });
  }

  update() {
    this.supabaseService.update(this.userForm.value).then((elem) => {});
  }
  setProfile() {
    // let userData: UserProfileData = {
    //   email: this.userForm.value.email,
    //   phone: this.userForm.value.cellphone,
    // };
    // this.usersService.setProfile(userData);
  }
}
