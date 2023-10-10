import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutReservationsComponent } from './checkout-reservations.component';

describe('CheckoutReservationsComponent', () => {
  let component: CheckoutReservationsComponent;
  let fixture: ComponentFixture<CheckoutReservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutReservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
