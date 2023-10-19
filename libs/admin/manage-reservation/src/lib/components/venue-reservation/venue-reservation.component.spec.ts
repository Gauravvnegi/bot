import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueReservationComponent } from './venue-reservation.component';

describe('VenueReservationComponent', () => {
  let component: VenueReservationComponent;
  let fixture: ComponentFixture<VenueReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
