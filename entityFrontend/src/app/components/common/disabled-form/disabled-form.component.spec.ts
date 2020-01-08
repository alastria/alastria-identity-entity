import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledFormComponent } from './disabled-form.component';

describe('DisabledFormComponent', () => {
  let component: DisabledFormComponent;
  let fixture: ComponentFixture<DisabledFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabledFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
