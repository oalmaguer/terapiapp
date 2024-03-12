import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaPacienteComponent } from './cita-paciente.component';

describe('CitaPacienteComponent', () => {
  let component: CitaPacienteComponent;
  let fixture: ComponentFixture<CitaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitaPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
