import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestBookingInfoComponent } from './guest-booking-info.component';

describe('GuestBookingInfoComponent', () => {
  let component: GuestBookingInfoComponent;
  let fixture: ComponentFixture<GuestBookingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestBookingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestBookingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
