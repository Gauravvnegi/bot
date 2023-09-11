import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaReservationComponent } from './spa-reservation.component';

describe('SpaReservationComponent', () => {
  let component: SpaReservationComponent;
  let fixture: ComponentFixture<SpaReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
