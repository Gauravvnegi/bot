import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStatisticsComponent } from './checkout-statistics.component';

describe('CheckoutStatisticsComponent', () => {
  let component: CheckoutStatisticsComponent;
  let fixture: ComponentFixture<CheckoutStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
