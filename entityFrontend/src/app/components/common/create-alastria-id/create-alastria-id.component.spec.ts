import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAlastriaIdComponent } from './create-alastria-id.component';

describe('CreateAlastriaIdComponent', () => {
  let component: CreateAlastriaIdComponent;
  let fixture: ComponentFixture<CreateAlastriaIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAlastriaIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAlastriaIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
