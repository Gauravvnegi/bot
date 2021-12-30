import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDatatableComponent } from './reservation.component';

describe('ReservationDatatableComponent', () => {
  let component: ReservationDatatableComponent;
  let fixture: ComponentFixture<ReservationDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
