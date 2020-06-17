import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRevokeCredentialsComponent } from './modal-revoke-credentials.component';

describe('ModalFillProfileComponent', () => {
  let component: ModalRevokeCredentialsComponent;
  let fixture: ComponentFixture<ModalRevokeCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRevokeCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRevokeCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
