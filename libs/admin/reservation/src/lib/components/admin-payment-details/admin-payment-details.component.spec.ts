import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentDetailsComponent } from './admin-payment-details.component';

describe('AdminPaymentDetailsComponent', () => {
  let component: AdminPaymentDetailsComponent;
  let fixture: ComponentFixture<AdminPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
