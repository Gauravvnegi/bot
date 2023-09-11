import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRuleComponent } from './payment-rule.component';

describe('PaymentRuleComponent', () => {
  let component: PaymentRuleComponent;
  let fixture: ComponentFixture<PaymentRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
