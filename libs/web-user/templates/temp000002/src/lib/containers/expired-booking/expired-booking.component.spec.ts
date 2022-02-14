import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredBookingComponent } from './expired-booking.component';

describe('ExpiredBookingComponent', () => {
  let component: ExpiredBookingComponent;
  let fixture: ComponentFixture<ExpiredBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
