import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInformationComponent } from './guest-information.component';

describe('GuestInformationComponent', () => {
  let component: GuestInformationComponent;
  let fixture: ComponentFixture<GuestInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
