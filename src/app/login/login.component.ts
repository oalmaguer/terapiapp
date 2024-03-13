import { Component, NgZone, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userForm: FormGroup;
  errorMessage: string;
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.supabaseService
      .login(this.userForm.value.email, this.userForm.value.password)
      .then((elem) => {
        if (elem.error) {
          this.errorMessage = elem.error.message;
          return;
        }
        this.router.navigate(['/dashboard']); // Replace 123 with the actual parameter value
      })
      .catch((err) => {});
  }

  onSubmit() {}
}
