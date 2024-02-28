import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-doctors',
  templateUrl: './register-doctors.component.html',
  styleUrls: ['./register-doctors.component.scss'],
})
export class RegisterDoctorsComponent {
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      skill: ['', Validators.required],
      email: ['', Validators.required],
      cellphone: ['', Validators.required],
    });
  }

  register() {
    this.update();
  }

  update() {
    this.supabaseService.updateDocInfo(this.userForm.value).then((elem) => {});
  }
}
