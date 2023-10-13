import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCalendarViewComponent } from './reservation-calendar-view.component';

describe('ReservationCalendarViewComponent', () => {
  let component: ReservationCalendarViewComponent;
  let fixture: ComponentFixture<ReservationCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
