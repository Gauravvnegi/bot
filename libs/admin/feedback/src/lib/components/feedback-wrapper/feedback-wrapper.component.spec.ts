import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackWrapperComponent } from './feedback-wrapper.component';

describe('FeedbackWrapperComponent', () => {
  let component: FeedbackWrapperComponent;
  let fixture: ComponentFixture<FeedbackWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
