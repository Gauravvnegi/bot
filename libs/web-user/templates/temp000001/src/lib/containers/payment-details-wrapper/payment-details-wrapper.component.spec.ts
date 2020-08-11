import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsWrapperComponent } from './payment-details-wrapper.component';

describe('PaymentDetailsWrapperComponent', () => {
  let component: PaymentDetailsWrapperComponent;
  let fixture: ComponentFixture<PaymentDetailsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
