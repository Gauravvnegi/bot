import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinStatisticsComponent } from './checkin-statistics.component';

describe('CheckinStatisticsComponent', () => {
  let component: CheckinStatisticsComponent;
  let fixture: ComponentFixture<CheckinStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
