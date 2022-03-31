import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StayFeedbackComponent } from './stay-feedback.component';

describe('StayFeedbackComponent', () => {
  let component: StayFeedbackComponent;
  let fixture: ComponentFixture<StayFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
