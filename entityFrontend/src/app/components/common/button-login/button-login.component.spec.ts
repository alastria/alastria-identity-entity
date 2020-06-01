import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLoginComponent } from './button-login.component';

describe('ButtonLoginComponent', () => {
  let component: ButtonLoginComponent;
  let fixture: ComponentFixture<ButtonLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
