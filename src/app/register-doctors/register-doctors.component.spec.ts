import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDoctorsComponent } from './register-doctors.component';

describe('RegisterDoctorsComponent', () => {
  let component: RegisterDoctorsComponent;
  let fixture: ComponentFixture<RegisterDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterDoctorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
