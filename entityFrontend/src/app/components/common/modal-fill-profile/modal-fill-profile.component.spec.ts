import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFillProfileComponent } from './modal-fill-profile.component';

describe('ModalFillProfileComponent', () => {
  let component: ModalFillProfileComponent;
  let fixture: ComponentFixture<ModalFillProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFillProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFillProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
