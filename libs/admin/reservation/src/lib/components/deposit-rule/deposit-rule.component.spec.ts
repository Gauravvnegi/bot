import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositRuleComponent } from './deposit-rule.component';

describe('DepositRuleComponent', () => {
  let component: DepositRuleComponent;
  let fixture: ComponentFixture<DepositRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
