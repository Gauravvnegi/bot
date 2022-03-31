import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantFeedbackComponent } from './instant-feedback.component';

describe('InstantFeedbackComponent', () => {
  let component: InstantFeedbackComponent;
  let fixture: ComponentFixture<InstantFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
