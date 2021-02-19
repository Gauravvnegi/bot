import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDetailsWrapperComponent } from './feedback-details-wrapper.component';

describe('FeedbackDetailsWrapperComponent', () => {
  let component: FeedbackDetailsWrapperComponent;
  let fixture: ComponentFixture<FeedbackDetailsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
