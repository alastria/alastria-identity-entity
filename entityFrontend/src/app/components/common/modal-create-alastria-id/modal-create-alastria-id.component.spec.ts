import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateAlastriaIdComponent } from './modal-create-alastria-id.component';

describe('ModalCreateAlastriaIdComponent', () => {
  let component: ModalCreateAlastriaIdComponent;
  let fixture: ComponentFixture<ModalCreateAlastriaIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateAlastriaIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateAlastriaIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
