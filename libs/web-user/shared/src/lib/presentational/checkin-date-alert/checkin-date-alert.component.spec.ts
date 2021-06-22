import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinDateAlertComponent } from './checkin-date-alert.component';

describe('CheckinDateAlertComponent', () => {
  let component: CheckinDateAlertComponent;
  let fixture: ComponentFixture<CheckinDateAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinDateAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinDateAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
