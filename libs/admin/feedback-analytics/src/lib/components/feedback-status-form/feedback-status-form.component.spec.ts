import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatusFormComponent } from './feedback-status-form.component';

describe('FeedbackStatusFormComponent', () => {
  let component: FeedbackStatusFormComponent;
  let fixture: ComponentFixture<FeedbackStatusFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackStatusFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
