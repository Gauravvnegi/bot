import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintAnalyticsComponent } from './complaint-analytics.component';

describe('ComplaintAnalyticsComponent', () => {
  let component: ComplaintAnalyticsComponent;
  let fixture: ComponentFixture<ComplaintAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
