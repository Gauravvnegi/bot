import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPaymentsStatisticsComponent } from './guest-payments-statistics.component';

describe('GuestPaymentsStatisticsComponent', () => {
  let component: GuestPaymentsStatisticsComponent;
  let fixture: ComponentFixture<GuestPaymentsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestPaymentsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestPaymentsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
