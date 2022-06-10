import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRateComponent } from './feedback-rate.component';

describe('FeedbackRateComponent', () => {
  let component: FeedbackRateComponent;
  let fixture: ComponentFixture<FeedbackRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
