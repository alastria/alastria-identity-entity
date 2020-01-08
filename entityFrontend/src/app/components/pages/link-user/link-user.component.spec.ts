import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkUserComponent } from './link-user.component';

describe('LinkUserComponent', () => {
  let component: LinkUserComponent;
  let fixture: ComponentFixture<LinkUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
