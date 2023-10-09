import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinReservationsComponent } from './checkin-reservations.component';

describe('CheckinReservationsComponent', () => {
  let component: CheckinReservationsComponent;
  let fixture: ComponentFixture<CheckinReservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinReservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
