import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuResponsiveComponent } from './menu-responsive.component';

describe('MenuResponsiveComponent', () => {
  let component: MenuResponsiveComponent;
  let fixture: ComponentFixture<MenuResponsiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuResponsiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
